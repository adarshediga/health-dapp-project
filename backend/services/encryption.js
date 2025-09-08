const crypto = require("crypto");
const fs = require("fs");

async function encryptFile(filePath) {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const input = fs.createReadStream(filePath);
  const encryptedPath = filePath + ".enc";
  const output = fs.createWriteStream(encryptedPath);

  input.pipe(cipher).pipe(output);

  return new Promise((resolve, reject) => {
    output.on("finish", () => {
      resolve({
        encryptedPath,
        keyHex: "0x" + key.toString("hex"),
        ivHex: "0x" + iv.toString("hex"),
      });
    });
    output.on("error", reject);
  });
}

module.exports = { encryptFile };
