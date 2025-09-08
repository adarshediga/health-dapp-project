// scripts/uploadRecord.js
const { ethers } = require("hardhat");
const fs = require("fs");
const axios = require("axios");
const crypto = require("crypto");
const FormData = require("form-data");
require("dotenv").config(); // load .env

async function uploadToPinata(filePath) {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const data = new FormData();
  data.append("file", fs.createReadStream(filePath));

  const res = await axios.post(url, data, {
    maxBodyLength: "Infinity",
    headers: {
      ...data.getHeaders(),
      pinata_api_key: process.env.PINATA_API_KEY,
      pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
    },
  });

  return res.data.IpfsHash;
}

async function main() {
  const patientRegistryAddr = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed"; // your deployed PatientRegistry
  const patientRegistry = await ethers.getContractAt("PatientRegistry", patientRegistryAddr);

  const patientAddress = "0x1234567890123456789012345678901234567890"; // replace with actual
  const hospitalAddress = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"; // replace with actual

  // Generate AES key
  const rawKey = crypto.randomBytes(32); 
  const aesKeyHex = "0x" + rawKey.toString("hex"); // bytes32 format

  // Upload file to Pinata
  const ipfsHash = await uploadToPinata("./scripts/record.txt"); // file inside scripts folder
  console.log("✅ Uploaded to IPFS:", ipfsHash);

  // Call contract
  const tx = await patientRegistry.uploadRecord(
    patientAddress,
    ipfsHash
  );
  await tx.wait();

  console.log("✅ Record uploaded successfully for patient:", patientAddress);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
