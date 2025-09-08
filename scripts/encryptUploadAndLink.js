// npx hardhat run scripts/encryptUploadAndLink.js --network localhost
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');
const { makeClient } = require('../ipfs/client');
const { encrypt } = require('../crypto/aes256gcm');


async function main() {
const filePath = process.argv[2] || 'samples/report.pdf';
const passphrase = process.env.W4_PASSPHRASE;
if (!passphrase) throw new Error('Missing W4_PASSPHRASE');


const data = fs.readFileSync(filePath);
const { cipher, iv, authTag, salt } = encrypt(data, passphrase);


// Option A: store salt alongside bytes (prepend header) so fetchers have salt value
const header = Buffer.concat([Buffer.from('DHRECv1'), salt]); // 6 + 16 bytes
const payload = Buffer.concat([header, cipher]);


const ipfs = makeClient();
const { cid } = await ipfs.add({
path: path.basename(filePath) + '.enc',
content: payload
});


console.log('Encrypted CID:', cid.toString());


// Link on‑chain
const PATIENT_REGISTRY = process.env.PATIENT_REGISTRY;
const [signer] = await ethers.getSigners(); // use whichever account (doctor or patient)
const pr = await ethers.getContractAt('PatientRegistry', PATIENT_REGISTRY, signer);


const stats = fs.statSync(filePath);
const tx = await pr.addRecord(
process.env.PATIENT_ADDRESS || (await signer.getAddress()),
cid.toString(),
path.basename(filePath),
detectMime(filePath),
stats.size,
bytes32Pad(iv),
bytes32Pad(authTag)
);
await tx.wait();
console.log('Record linked on‑chain');
}


function detectMime(p) {
const ext = path.extname(p).toLowerCase();
if (ext === '.pdf') return 'application/pdf';
if (['.png', '.jpg', '.jpeg'].includes(ext)) return 'image/' + ext.replace('.', '');
return 'application/octet-stream';
}


function bytes32Pad(buf) {
// right‑pad into 32 bytes
if (buf.length > 32) throw new Error('buf too long');
return '0x' + Buffer.concat([buf, Buffer.alloc(32 - buf.length)]).toString('hex');
}


main().catch((e) => { console.error(e); process.exit(1); });