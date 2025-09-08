const hre = require("hardhat");

async function main() {
  console.log("📡 Fetching doctor data...");

  const DoctorRegistry = await hre.ethers.getContractFactory("DoctorRegistry");

  // ✅ Use the deployed address
  const registry = await DoctorRegistry.attach("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9");

  const [signer] = await hre.ethers.getSigners();
  const doctorAddress = signer.address;

  const [name, specialization, wallet] = await registry.getDoctor(doctorAddress);

  console.log("👨‍⚕️ Doctor Info:");
  console.log("Name:         ", name);
  console.log("Specialization:", specialization);
  console.log("Wallet:       ", wallet);
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exitCode = 1;
});
