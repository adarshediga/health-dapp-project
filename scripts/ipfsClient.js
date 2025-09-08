// scripts/ipfsClient.js
import { create } from "ipfs-http-client";

// ✅ IPFS Infura credentials (replace with your own if needed)
const projectId = "YOUR_INFURA_PROJECT_ID";
const projectSecret = "YOUR_INFURA_PROJECT_SECRET";

// Infura auth header
const auth =
  "Basic " +
  Buffer.from(projectId + ":" + projectSecret).toString("base64");

// ✅ Create IPFS client
const ipfsClient = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

// ✅ Function to upload a file to IPFS
export async function uploadToIPFS(content) {
  try {
    const result = await ipfsClient.add(content, {
      wrapWithDirectory: false,
      progress: (prog) => console.log(`📤 Uploading... ${prog} bytes`),
    });
    console.log("✅ IPFS Upload Success:", result.path);
    return result.path;
  } catch (error) {
    console.error("❌ Error uploading to IPFS:", error.message);
    throw error;
  }
}

// ✅ Function to fetch file back from IPFS
export async function getFromIPFS(cid) {
  try {
    let content = "";
    for await (const chunk of ipfsClient.cat(cid)) {
      content += chunk.toString();
    }
    console.log("📥 Retrieved from IPFS:", content);
    return content;
  } catch (error) {
    console.error("❌ Error fetching from IPFS:", error.message);
    throw error;
  }
}
