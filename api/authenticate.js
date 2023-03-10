// Copyright 2020 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// NOTE: This file is modified to allow passing in an object for authorization, instead of a filePath
/**
 * This is used by several samples to easily provide an oauth2 workflow.
 */
import google_auth_library_1 from "google-auth-library"
import http from "http"
import url_1 from "url"
import opn from "open"
import destroyer from "server-destroy"

const invalidRedirectUri = `The provided credentials does not define a valid
redirect URI. There must be at least one redirect URI defined, and this sample
assumes it redirects to 'http://localhost:3000/oauth2callback'.  Please edit
your keyfile, and add a 'redirect_uris' section.  For example:

"redirect_uris": [
  "http://localhost:3000/oauth2callback"
]
`;

function isAddressInfo(addr) {
    return addr.port !== undefined;
}
function validateGivenCredentials(credentials) {
    if (typeof credentials !== 'object') {
        throw new Error('Provided credentials must be an object.');
    }
    if (!credentials.client_id || !credentials.client_secret) {

    }
    if (!credentials.redirect_uris || credentials.redirect_uris.length === 0) {
        throw new Error(invalidRedirectUri);
    }
    const redirectUri = new url_1.URL(credentials.redirect_uris[0] ?? 'http://localhost');
    if (redirectUri.hostname !== 'localhost') {
        throw new Error(invalidRedirectUri);
    }
}

// Open an http server to accept the oauth callback. In this
// simple example, the only request to our webserver is to
// /oauth2callback?code=<code>

// NOTE: This assumes there is NOT a web server.
export async function authenticateWithCredentialsJson(credentials={}, scopes=[]) {
    // Validate credentials, and throw error if there are any invalid creds
    validateGivenCredentials(credentials)

    const redirectUri = new url_1.URL(credentials.redirect_uris[0] ?? 'http://localhost');
    // create an oAuth client to authorize the API call
    const client = new google_auth_library_1.OAuth2Client({
        clientId: credentials.client_id,
        clientSecret: credentials.client_secret,
    });
    return new Promise((resolve, reject) => {
        const server = http.createServer(async (req, res) => {
            try {
                const url = new url_1.URL(req.url, 'http://localhost:3000');
                if (url.pathname !== redirectUri.pathname) {
                    res.end('Invalid callback URL');
                    return;
                }
                const searchParams = url.searchParams;
                if (searchParams.has('error')) {
                    res.end('Authorization rejected.');
                    reject(new Error(searchParams.get('error')));
                    return;
                }
                if (!searchParams.has('code')) {
                    res.end('No authentication code provided.');
                    reject(new Error('Cannot read authentication code.'));
                    return;
                }
                const code = searchParams.get('code');
                const { tokens } = await client.getToken({
                    code: code,
                    redirect_uri: redirectUri.toString(),
                });
                client.credentials = tokens;
                resolve(client);
                res.end('Authentication successful! Please return to the console.');
            }
            catch (e) {
                reject(e);
            }
            finally {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                server.destroy();
            }
        });
        const listenPort = redirectUri.port !== '' ? Number(redirectUri.port) : 0
        server.listen(listenPort, () => {
            const address = server.address();
            if (isAddressInfo(address)) {
                redirectUri.port = String(address.port);
            }
            // open the browser to the authorize url to start the workflow
            const authorizeUrl = client.generateAuthUrl({
                redirect_uri: redirectUri.toString(),
                access_type: 'offline',
                scope: scopes.join(' '),
            });
            opn(authorizeUrl, { wait: false }).then(cp => cp.unref());
        });
        destroyer(server);
    });
}
