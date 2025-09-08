const hre = require("hardhat");

async function main() {
  console.log("👤 Registering a new patient...");

  const patientRegistryAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const hospitalAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // hospital address from deploy

  const PatientRegistry = await hre.ethers.getContractFactory("PatientRegistry");
  const contract = await PatientRegistry.attach(patientRegistryAddress);

  const [_, patientSigner] = await hre.ethers.getSigners(); 
  // 👆 using 2nd account as the patient

  const name = "Adarsh";
  const age = 21;

  // patient calls registerPatient with hospital address
  const tx = await contract.connect(patientSigner).registerPatient(
    name,
    age,
    hospitalAddress
  );
  await tx.wait();

  console.log(`✅ Patient registered successfully: ${patientSigner.address} under hospital: ${hospitalAddress}`);
}

main().catch((error) => {
  console.error("❌ Registration failed:", error);
  process.exitCode = 1;
});
