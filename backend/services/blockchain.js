const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); // Hardhat local
const signer = provider.getSigner(0); // First account

// Load contract ABI
const abi = JSON.parse(fs.readFileSync("../artifacts/contracts/PatientRegistry.sol/PatientRegistry.json")).abi;
const patientRegistryAddr = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"; // change after deploy
const contract = new ethers.Contract(patientRegistryAddr, abi, signer);

async function addRecord(patient, ipfsHash, aesKey, hospital) {
  const tx = await contract.addRecord(patient, ipfsHash, aesKey, hospital);
  await tx.wait();
  console.log("✅ Record stored on-chain for patient:", patient);
}

async function getRecords(patient) {
  return await contract.getRecords(patient);
}

module.exports = { addRecord, getRecords };
