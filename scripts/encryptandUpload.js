const fs = require("fs");
const path = require("path");
const CryptoJS = require("crypto-js");
const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

async function main() {
  // Input/output paths
  const inputFile = path.join(__dirname, "../test/sample_plain.txt");
  const encryptedFile = path.join(__dirname, "../test/sample_encrypted.txt");

  // 1️⃣ Load AES key from .env
  const key = CryptoJS.enc.Hex.parse(process.env.AES_KEY); // 32 bytes
  const iv = CryptoJS.lib.WordArray.random(16); // 16 bytes
  const ivHex = iv.toString(CryptoJS.enc.Hex);

  // 2️⃣ Read plaintext
  const data = fs.readFileSync(inputFile, "utf8");

  // 3️⃣ Encrypt using AES
  const encrypted = CryptoJS.AES.encrypt(data, key, { iv });
  const encryptedHex = encrypted.ciphertext.toString(CryptoJS.enc.Hex);

  // Save encrypted data locally
  fs.writeFileSync(encryptedFile, encryptedHex);

  console.log("🔐 Encryption complete");
  console.log("IV (save this):", ivHex);

  // 4️⃣ Upload to IPFS via Pinata
  const formData = new FormData();
  formData.append("file", fs.createReadStream(encryptedFile));

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      maxContentLength: Infinity,
      headers: {
        ...formData.getHeaders(),
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    }
  );

  const cid = res.data.IpfsHash;
  console.log("✅ Uploaded to IPFS:");
  console.log(`CID: ${cid}`);
  console.log(`Gateway: https://gateway.pinata.cloud/ipfs/${cid}`);

  // 5️⃣ Save CID + IV for blockchain step
  fs.writeFileSync(
    path.join(__dirname, "../test/record_meta.json"),
    JSON.stringify({ cid, iv: ivHex }, null, 2)
  );

  console.log("📄 Metadata saved to test/record_meta.json");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
});
