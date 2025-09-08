const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying DoctorRegistry...");

  // Step 1: Load the contract
  const DoctorRegistry = await hre.ethers.getContractFactory("DoctorRegistry");

  // Step 2: Deploy it
  const contract = await DoctorRegistry.deploy();

  // Step 3: Wait for deployment to complete
  await contract.waitForDeployment();

  // Step 4: Get deployed address
  const address = await contract.getAddress();

  console.log("✅ DoctorRegistry deployed at:", address);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
