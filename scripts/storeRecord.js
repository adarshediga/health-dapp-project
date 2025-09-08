const hre = require("hardhat");

async function main() {
  const patientRegistryAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const cid = "Qme3KRYXPHDeBrNjXde2ABs8foLJRNEuKirmdXHd56YXhi";
  const iv = "64686d66f69353c5d23f4b6e2613b79e";
  const patientAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  const PatientRegistry = await hre.ethers.getContractFactory("PatientRegistry");
  const contract = await PatientRegistry.attach(patientRegistryAddress);

  // get signer accounts
  const [doctor] = await hre.ethers.getSigners();

  // call addMedicalRecord as doctor
  const tx = await contract.connect(doctor).addMedicalRecord(patientAddress, cid, iv);
  await tx.wait();

  console.log("✅ Medical record added to blockchain successfully!");
}

main().catch((error) => {
  console.error("❌ Failed to store medical record:", error);
  process.exitCode = 1;
});
