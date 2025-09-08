const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("🚀 Deploying from:", deployer.address);

  const HospitalRegistry = await hre.ethers.getContractFactory("HospitalRegistry");
  const hospitalRegistry = await HospitalRegistry.deploy();
  await hospitalRegistry.waitForDeployment();

  const DoctorRegistry = await hre.ethers.getContractFactory("DoctorRegistry");
  const doctorRegistry = await DoctorRegistry.deploy();
  await doctorRegistry.waitForDeployment();

  const PatientRegistry = await hre.ethers.getContractFactory("PatientRegistry");
  const patientRegistry = await PatientRegistry.deploy(doctorRegistry.target, hospitalRegistry.target);
  await patientRegistry.waitForDeployment();

  console.log("✅ Deployed:");
  console.log("HospitalRegistry:", hospitalRegistry.target);
  console.log("DoctorRegistry:  ", doctorRegistry.target);
  console.log("PatientRegistry: ", patientRegistry.target);
}

main().catch(err => { console.error(err); process.exitCode = 1; });
