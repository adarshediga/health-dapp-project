const hre = require("hardhat");

async function main() {
  const accounts = await hre.ethers.getSigners();
  accounts.forEach((account, index) => {
    console.log(`Account ${index}: ${account.address}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
