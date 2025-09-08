// ipfsClient.js
require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
const IPFS_GATEWAY = process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

/**
 * Upload a file to IPFS via Pinata
 * @param {string} filePath - Local path of file to upload
 * @returns {Promise<{ cid: string, url: string }>}
 */
async function uploadFileToIPFS(filePath) {
  if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
    throw new Error('Missing PINATA_API_KEY or PINATA_SECRET_API_KEY in .env');
  }

  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  const res = await axios.post(url, formData, {
    maxContentLength: Infinity,
    headers: {
      ...formData.getHeaders(),
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  });

  const cid = res.data.IpfsHash;
  return {
    cid,
    url: IPFS_GATEWAY.endsWith('/') ? `${IPFS_GATEWAY}${cid}` : `${IPFS_GATEWAY}/${cid}`,
  };
}

module.exports = { uploadFileToIPFS };
