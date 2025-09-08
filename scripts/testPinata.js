require("dotenv").config();
const pinataSDK = require("@pinata/sdk");
const crypto = require("crypto");

const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);

// AES encryption function
function encryptData(data, secretKey) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(secretKey, "hex"), iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return { encryptedData: encrypted, iv: iv.toString("hex") };
}

async function uploadEncryptedRecord() {
    try {
        const secretKey = crypto.randomBytes(32).toString("hex"); // AES-256 key
        const data = "Patient diagnosis: Hypertension, Prescription: Medication X";

        // Encrypt medical record
        const { encryptedData, iv } = encryptData(data, secretKey);

        // Prepare JSON for Pinata
        const jsonData = {
            iv,
            encryptedData,
        };

        // Upload to IPFS
        const result = await pinata.pinJSONToIPFS(jsonData);
        console.log("IPFS Hash:", result.IpfsHash);
        console.log("AES Key (keep safe!):", secretKey);
    } catch (error) {
        console.error("Error uploading to Pinata:", error);
    }
}

uploadEncryptedRecord();
