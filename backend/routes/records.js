// backend/routes/records.js
import express from "express";
import multer from "multer";
import fs from "fs";
import crypto from "crypto";
import { uploadToPinata } from "../services/pinata.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temporary upload storage

// AES secret key (demo only)
const AES_SECRET = "12345678901234567890123456789012"; // 32 chars

// POST /api/records/upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read uploaded file
    const fileBuffer = fs.readFileSync(req.file.path);

    // AES encryption
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(AES_SECRET), iv);
    let encrypted = cipher.update(fileBuffer);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Save encrypted data temporarily
    const encryptedPath = `uploads/encrypted_${req.file.originalname}`;
    fs.writeFileSync(encryptedPath, Buffer.concat([iv, encrypted]));

    // Upload encrypted file to Pinata
    const ipfsHash = await uploadToPinata(encryptedPath);

    // Cleanup temp files
    fs.unlinkSync(req.file.path);
    fs.unlinkSync(encryptedPath);

    res.json({
      message: "✅ File uploaded and encrypted successfully",
      ipfsHash,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
});

// ✅ Make sure to export router correctly
export default router;
