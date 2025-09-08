const fs = require("fs");
const path = require("path");
const CryptoJS = require("crypto-js");
require("dotenv").config();
const { client } = require("../utils/ipfsClient");

async function main() {
  const filePath = path.join(__dirname, "../test/sample_encrypted.txt");

  // Encrypt the file content
  const data = fs.readFileSync(filePath, "utf8");
  const key = CryptoJS.enc.Utf8.parse(process.env.AES_KEY); // 32 bytes
  const iv = CryptoJS.lib.WordArray.random(16); // 16 bytes IV

  const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv });
  const encryptedContent = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
  const ivHex = iv.toString(CryptoJS.enc.Hex); // Convert IV to string

  // Write encrypted data back (optional)
  fs.writeFileSync(filePath, encryptedContent);

  // Upload to IPFS
  const result = await client.add(fs.readFileSync(filePath));
  const cid = result.path;

  console.log("✅ Uploaded to IPFS via Pinata:");
  console.log(`https://gateway.pinata.cloud/ipfs/${cid}`);
  console.log("🔐 IV used for encryption:", ivHex); // <- Print this!
}

main().catch((err) => {
  console.error("❌ IPFS Upload Error:", err);
});
