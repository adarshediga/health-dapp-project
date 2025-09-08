const hre = require("hardhat");

async function main() {
  console.log("🏥 Registering a hospital...");

  const hospitalRegistryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const HospitalRegistry = await hre.ethers.getContractFactory("HospitalRegistry");
  const contract = await HospitalRegistry.attach(hospitalRegistryAddress);

  const [hospitalSigner] = await hre.ethers.getSigners(); // 1st account

  const hospitalName = "Apollo";
  const location = "Bangalore";

  const tx = await contract.connect(hospitalSigner).registerHospital(hospitalName, location);
  await tx.wait();

  console.log("✅ Hospital registered:", hospitalSigner.address);
}

main().catch((error) => {
  console.error("❌ Hospital registration failed:", error);
  process.exitCode = 1;
});
