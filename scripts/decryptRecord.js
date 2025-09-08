const fs = require("fs");
const path = require("path");
const CryptoJS = require("crypto-js");
require("dotenv").config();

const encryptedFilePath = path.join(__dirname, "../test/encrypted_from_ipfs.txt");
const decryptedFilePath = path.join(__dirname, "../test/decrypted_output.txt");

// Read encrypted Base64 string
const encryptedBase64 = fs.readFileSync(encryptedFilePath, "utf8").trim();

// Parse key and IV
const key = CryptoJS.enc.Hex.parse(process.env.AES_KEY);
const iv = CryptoJS.enc.Hex.parse("64686d66f69353c5d23f4b6e2613b79e"); // Use your actual IV

// Decrypt using AES
const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, { iv });

// Convert decrypted WordArray to UTF-8 string
const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

// Save the result
fs.writeFileSync(decryptedFilePath, plaintext);
console.log("✅ Decryption complete. File saved to:", decryptedFilePath);
