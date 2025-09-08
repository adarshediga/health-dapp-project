const hre = require("hardhat");

async function main() {
  console.log("🏥 Deploying HospitalRegistry...");

  // Step 1: Load the contract
  const HospitalRegistry = await hre.ethers.getContractFactory("HospitalRegistry");

  // Step 2: Deploy the contract
  const contract = await HospitalRegistry.deploy();

  // Step 3: Wait for deployment
  await contract.waitForDeployment();

  // Step 4: Log address
  const address = await contract.getAddress();
  console.log("✅ HospitalRegistry deployed at:", address);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
