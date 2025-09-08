const { ethers } = require("hardhat");
const fs = require("fs");
const axios = require("axios");
const crypto = require("crypto");
require("dotenv").config();

async function downloadFromIPFS(ipfsHash) {
  const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return response.data;
}

function decryptData(encryptedData, aesKeyHex) {
  const key = Buffer.from(aesKeyHex.slice(2), "hex"); // remove 0x
  const iv = encryptedData.slice(0, 16); // first 16 bytes are IV
  const ciphertext = encryptedData.slice(16);

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(ciphertext);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted;
}

async function main() {
  const patientRegistryAddr = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed"; // change if redeployed
  const patientRegistry = await ethers.getContractAt("PatientRegistry", patientRegistryAddr);

  const patientAddress = "0x1234567890123456789012345678901234567890"; // same as used in upload

  console.log("📂 Fetching records for:", patientAddress);

  const records = await patientRegistry.getRecords(patientAddress);
  if (records.length === 0) {
    console.log("❌ No records found for this patient");
    return;
  }

  for (const record of records) {
    console.log("✅ Found record on IPFS:", record.ipfsHash);

    // Download from IPFS
    const encryptedData = await downloadFromIPFS(record.ipfsHash);

    // Decrypt using stored AES key
    const decrypted = decryptData(Buffer.from(encryptedData), record.encryptionKey);

    // Save locally
    fs.writeFileSync(`./downloaded_${record.ipfsHash}.txt`, decrypted);
    console.log(`📄 Record decrypted & saved: downloaded_${record.ipfsHash}.txt`);
  }
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
