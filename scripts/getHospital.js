const hre = require("hardhat");

async function main() {
  console.log("🔍 Fetching hospital details...");

  const HospitalRegistry = await hre.ethers.getContractFactory("HospitalRegistry");

  // Replace with your deployed HospitalRegistry address
  const registry = await HospitalRegistry.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

  const [signer] = await hre.ethers.getSigners(); // signer is the hospital wallet

  const [name, location, wallet] = await registry.getHospital(signer.address);

  console.log("🏥 Hospital Details:");
  console.log("Name:     ", name);
  console.log("Location: ", location);
  console.log("Wallet:   ", wallet);
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exitCode = 1;
});
