// crypto/aes256gcm.js
// AES‑256‑GCM with PBKDF2‑HMAC‑SHA256 key derivation
// Usage: encrypt(buffer, passphrase) -> {cipher, iv, authTag, salt}
// decrypt(cipher, passphrase, {iv, authTag, salt}) -> buffer


const crypto = require('crypto');


const IV_BYTES = 12; // GCM 96‑bit IV recommended
const SALT_BYTES = 16;
const KEY_BYTES = 32; // AES‑256
const PBKDF2_ITERS = 210000; // OWASP recommendation range


function deriveKey(passphrase, salt) {
return crypto.pbkdf2Sync(passphrase, salt, PBKDF2_ITERS, KEY_BYTES, 'sha256');
}


function encrypt(plainBuffer, passphrase) {
const iv = crypto.randomBytes(IV_BYTES);
const salt = crypto.randomBytes(SALT_BYTES);
const key = deriveKey(passphrase, salt);
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const enc1 = cipher.update(plainBuffer);
const enc2 = cipher.final();
const authTag = cipher.getAuthTag();
return { cipher: Buffer.concat([enc1, enc2]), iv, authTag, salt };
}


function decrypt(cipherBuffer, passphrase, { iv, authTag, salt }) {
const key = deriveKey(passphrase, salt);
const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
decipher.setAuthTag(authTag);
const dec1 = decipher.update(cipherBuffer);
const dec2 = decipher.final();
return Buffer.concat([dec1, dec2]);
}


module.exports = { encrypt, decrypt };