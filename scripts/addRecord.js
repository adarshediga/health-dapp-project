const hre = require("hardhat");
const fs = require("fs");
const crypto = require("crypto");
const { create } = require("ipfs-http-client"); // ✅ FIXED here

const algorithm = "aes-256-cbc";
const secretKey = crypto.randomBytes(32); // 🔐 In production, store securely
const iv = crypto.randomBytes(16);

// AES encryption function
function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encryptedData: encrypted, iv: iv.toString("hex") };
}

async function main() {
  console.log("🔐 Encrypting and uploading medical record...");

  // 1. Read file
  const plainText = fs.readFileSync("records/sample_record.txt", "utf8");

  // 2. Encrypt file
  const { encryptedData, iv: ivHex } = encrypt(plainText);

  // 3. Save encrypted file
  fs.writeFileSync("records/encrypted_record.txt", encryptedData, "utf8");

  // 4. Upload to IPFS
  const ipfs = create({ host: "localhost", port: "5001", protocol: "http" }); // ✅ FIXED here
  const file = fs.readFileSync("records/encrypted_record.txt");
  const result = await ipfs.add(file);

  console.log("✅ IPFS hash:", result.path);

  // 5. Save CID to smart contract
  const patientRegistryAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // ⚠️ Update if needed
  const PatientRegistry = await hre.ethers.getContractFactory("PatientRegistry");
  const contract = await PatientRegistry.attach(patientRegistryAddress);

  const [signer] = await hre.ethers.getSigners();
  const tx = await contract.connect(signer).addMedicalRecord(signer.address, result.path);
  await tx.wait();

  console.log("✅ Medical record stored on-chain!");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exitCode = 1;
});
