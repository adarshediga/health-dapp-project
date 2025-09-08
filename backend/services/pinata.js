import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

// Function to upload file to Pinata
export async function uploadFileToIPFS(filePath) {
  try {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    const data = new FormData();
    data.append("file", fs.createReadStream(filePath));

    const response = await axios.post(url, data, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    return {
      cid: response.data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
    };
  } catch (err) {
    console.error("❌ Pinata upload failed:", err);
    throw err;
  }
}
