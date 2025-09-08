const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();

  const HospitalRegistry = await hre.ethers.getContractFactory("HospitalRegistry");
  const hospitalRegistry = await HospitalRegistry.deploy();
  await hospitalRegistry.waitForDeployment();
  const hospitalRegistryAddress = await hospitalRegistry.getAddress();

  const DoctorRegistry = await hre.ethers.getContractFactory("DoctorRegistry");
  const doctorRegistry = await DoctorRegistry.deploy();
  await doctorRegistry.waitForDeployment();
  const doctorRegistryAddress = await doctorRegistry.getAddress();

  const PatientRegistry = await hre.ethers.getContractFactory("PatientRegistry");
  const patientRegistry = await PatientRegistry.deploy(
    doctorRegistryAddress,
    hospitalRegistryAddress
  );
  await patientRegistry.waitForDeployment();

  console.log("✅ Deployed PatientRegistry at:", await patientRegistry.getAddress());
}

main().catch((err) => {
  console.error("❌ Deployment error:", err);
  process.exit(1);
});
