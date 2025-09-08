const fs = require("fs");
const path = require("path");
const CryptoJS = require("crypto-js");
const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

async function main() {
  const filePath = path.join(__dirname, "../test/sample_plain.txt");
  const encryptedFilePath = path.join(__dirname, "../test/sample_encrypted.txt");

  // AES Key and IV
  const key = CryptoJS.enc.Hex.parse(process.env.AES_KEY); // 32 bytes (256 bits)
  const iv = CryptoJS.lib.WordArray.random(16); // 16 bytes (128 bits)
  const ivHex = iv.toString(CryptoJS.enc.Hex);  // for blockchain storage

  // Read the plaintext data
  const data = fs.readFileSync(filePath, "utf8");

  // Encrypt
  const encrypted = CryptoJS.AES.encrypt(data, key, { iv });
  // ✅ New (correct)
const encryptedBase64 = encrypted.toString(); // includes metadata, salt, etc.
fs.writeFileSync(encryptedFilePath, encryptedBase64);

  // Upload to Pinata
  const formData = new FormData();
  formData.append("file", fs.createReadStream(encryptedFilePath));

  const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
    maxContentLength: Infinity,
    headers: {
      ...formData.getHeaders(),
      pinata_api_key: process.env.PINATA_API_KEY,
      pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
    },
  });

  const cid = res.data.IpfsHash;
  console.log("✅ Uploaded to IPFS via Pinata:");
  console.log(`https://gateway.pinata.cloud/ipfs/${cid}`);
  console.log("🔐 IV used for encryption:", ivHex);
}

main().catch((err) => {
  console.error("❌ Encryption error:", err.message);
});
