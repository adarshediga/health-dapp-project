const hre = require("hardhat");

async function main() {
  const hospitalRegistryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const HospitalRegistry = await hre.ethers.getContractFactory("HospitalRegistry");
  const contract = await HospitalRegistry.attach(hospitalRegistryAddress);

  const [signer] = await hre.ethers.getSigners();
  const isHospital = await contract.isHospital(signer.address);

  console.log("🏥 Is hospital registered?", isHospital);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
