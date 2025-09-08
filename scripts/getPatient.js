const hre = require("hardhat");
async function main() {
  const patientRegistryAddress = "<PatientRegistry_ADDR>";
  const PatientRegistry = await hre.ethers.getContractFactory("PatientRegistry");
  const contract = PatientRegistry.attach(patientRegistryAddress);

  const [_, patientSigner] = await hre.ethers.getSigners();
  const data = await contract.getPatient(patientSigner.address);
  console.log("Patient details:", data);
}
main().catch(err => { console.error(err); process.exitCode = 1; });
