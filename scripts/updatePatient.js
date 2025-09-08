const hre = require("hardhat");

async function main() {
  console.log("🛠️ Attempting to update patient name...");

  const PatientRegistry = await hre.ethers.getContractFactory("PatientRegistry");

  // Replace with your new PatientRegistry address:
  const registry = await PatientRegistry.attach("0x0165878A594ca255338adfa4d48449f69242Eb8F");

  const [doctorSigner, patientSigner] = await hre.ethers.getSigners();

  // We’ll update the patient's name using the doctor account
  const tx = await registry.connect(doctorSigner).updatePatientName(patientSigner.address, "Adarsh Updated");

  await tx.wait();

  console.log("✅ Patient name updated successfully!");
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exitCode = 1;
});
