const hre = require("hardhat");

async function main() {
  console.log("👨‍⚕️ Registering a doctor...");

  // ✅ use deployed DoctorRegistry contract address
  const doctorRegistryAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; 

  // get contract instance
  const DoctorRegistry = await hre.ethers.getContractAt(
    "DoctorRegistry",
    doctorRegistryAddress
  );

  // signer for doctor (use deployer or change index for another account)
  const [doctorSigner] = await hre.ethers.getSigners();

  // register doctor
  const tx = await DoctorRegistry.connect(doctorSigner).registerDoctor(
    "Dr. Arjun",
    "Cardio"
  );
  await tx.wait();

  console.log("✅ Doctor registered:", doctorSigner.address);
}

main().catch(err => {
  console.error("❌ Doctor registration failed:", err);
  process.exitCode = 1;
});
