const hre = require("hardhat");

async function main() {
  const patientRegistryAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const patientAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Patient you registered

  const [_, doctorSigner] = await hre.ethers.getSigners(); // account[1] or [0] — doctor or patient

  const PatientRegistry = await hre.ethers.getContractFactory("PatientRegistry");
  const contract = await PatientRegistry.attach(patientRegistryAddress);

  const cids = await contract.connect(doctorSigner).getMedicalRecords(patientAddress);
  const ivs = await contract.connect(doctorSigner).getIVs(patientAddress);

  console.log("🧾 Encrypted Record IPFS CIDs:", cids);
  console.log("🔐 AES IVs:", ivs);
}

main().catch((error) => {
  console.error("❌ Failed to fetch records:", error);
  process.exitCode = 1;
});
