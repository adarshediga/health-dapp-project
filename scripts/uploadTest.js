require("dotenv").config();
const uploadFileToIPFS = require("../utils/ipfsClient");

async function main() {
  try {
    const ipfsURL = await uploadFileToIPFS("test/sample_encrypted.txt");
    console.log("✅ Uploaded to IPFS via Pinata:");
    console.log(ipfsURL);
  } catch (err) {
    console.error("❌ IPFS Upload Error:", err);
  }
}

main();
