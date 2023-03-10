const { readFile, writeFile } = require("fs").promises
const { setItem, getItem } = require("@react-native-async-storage/async-storage")
const credentials = require("./client_secret.json")

const TOKEN_KEY = "GOOGLE_API_TOKEN"
const CREDENTIALS_KEY = "CREDENTIALS_API_TOKEN"

exports.readTokenJson = () => {
    
}