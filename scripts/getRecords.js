// scripts/getRecords.js
const { ethers } = require("hardhat");
const path = require("path");
const fs = require("fs");

const PATIENT_REGISTRY = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"; // from deploy log
const PATIENT_ADDRESS  = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // registered patient

async function main() {
  console.log("📂 Fetching medical records…");

  const [caller] = await ethers.getSigners(); // patient or doctor

  // Load ABI manually
  const artifactPath = path.join(__dirname, "../artifacts/contracts/PatientRegistry.sol/PatientRegistry.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const patientRegistry = new ethers.Contract(PATIENT_REGISTRY, artifact.abi, caller);

  const recs = await patientRegistry.getRecords(PATIENT_ADDRESS);

  if (!recs || recs.length === 0) {
    console.log("No records found.");
    return;
  }

  recs.forEach((r, i) => {
    const ts = Number(r.timestamp);
    console.log(
      `[${i}] ipfsHash=${r.ipfsHash} | uploadedBy=${r.uploadedBy} | time=${new Date(
        ts * 1000
      ).toLocaleString()}`
    );
  });
}

main().catch((err) => {
  console.error("❌ Error fetching records:", err);
  process.exitCode = 1;
});
