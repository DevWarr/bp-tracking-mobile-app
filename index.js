const { authorize } = require("./api/getClient")
// import { authorize } from "./api/getClient"

(async function() {
    await authorize()
})()
