// node scripts/fetchAndDecrypt.js <patient> <index> <outPath>
require('dotenv').config();

const fs = require('fs');
const http = require('http');
const https = require('https');
const { ethers } = require('ethers');
const { decrypt } = require('../crypto/aes256gcm');

const MAGIC = Buffer.from('DHRECv1'); // 7 bytes
const SALT_BYTES = 16;

async function main() {
  const patient = process.argv[2];
  const index = Number(process.argv[3] || 0);
  const outPath = process.argv[4] || 'out.bin';

  if (!patient) {
    console.error('Usage: node scripts/fetchAndDecrypt.js <patient> <index> <outPath>');
    process.exit(1);
  }

  // Use a signer so msg.sender is authorized (patient or approved doctor)
  const rpcUrl = process.env.RPC_URL || 'http://127.0.0.1:8545';
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const pk =
    process.env.READER_PRIVATE_KEY ||
    process.env.DOCTOR_PRIVATE_KEY ||
    process.env.PATIENT_PRIVATE_KEY;

  if (!pk) {
    console.error('Missing READER_PRIVATE_KEY / DOCTOR_PRIVATE_KEY / PATIENT_PRIVATE_KEY in .env');
    process.exit(1);
  }

  const signer = new ethers.Wallet(pk, provider);

  const pr = new ethers.Contract(
    process.env.PATIENT_REGISTRY,
    [
      'function getRecord(address,uint256) view returns (tuple(string cid,string fileName,string mimeType,uint256 size,address createdBy,uint64 createdAt,bytes32 iv,bytes32 authTag))'
    ],
    signer // connect with signer so eth_call has a "from"
  );

  // ---- fetch record metadata (auth enforced in contract) ----
  const meta = await pr.getRecord(patient, index);

  const iv = b32trim(meta.iv);
  const authTag = b32trim(meta.authTag);

  // ---- fetch encrypted bytes from IPFS gateway ----
  const bytes = await fetchIPFS(meta.cid);

  if (bytes.length < MAGIC.length + SALT_BYTES) {
    throw new Error('Payload too short or corrupted');
  }

  // Validate header "DHRECv1" (7 bytes)
  const header = bytes.subarray(0, MAGIC.length);
  if (!header.equals(MAGIC)) {
    throw new Error('Bad payload header: expected "DHRECv1"');
  }

  // Parse salt + cipher
  const salt = bytes.subarray(MAGIC.length, MAGIC.length + SALT_BYTES);
  const cipher = bytes.subarray(MAGIC.length + SALT_BYTES);

  const passphrase = process.env.W4_PASSPHRASE;
  if (!passphrase) {
    throw new Error('Missing W4_PASSPHRASE in .env');
  }

  const plain = decrypt(cipher, passphrase, { iv, authTag, salt });
  fs.writeFileSync(outPath, plain);
  console.log('Decrypted ->', outPath, 'mime:', meta.mimeType);
  console.log('File name (meta):', meta.fileName);
}

function fetchIPFS(cid) {
  const base = process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
  const url = base.endsWith('/') ? base + cid : base + '/' + cid;
  const mod = url.startsWith('https') ? https : http;

  return new Promise((resolve, reject) => {
    mod
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`IPFS gateway error: ${res.statusCode}`));
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });
}

// Trim right-padded zeros from bytes32 -> Buffer (for IV/tag)
function b32trim(hexLike) {
  const arr = ethers.getBytes(hexLike); // Uint8Array(32)
  let end = arr.length;
  while (end > 0 && arr[end - 1] === 0) end--;
  return Buffer.from(arr.slice(0, end));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
