// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import recordsRoutes from "./routes/records.js"; // ✅ import modular routes

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Root route
app.get("/", (req, res) => {
  res.send("✅ Backend server is running!");
});

// Modular routes
app.use("/api/records", recordsRoutes);

// Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📂 Records route available at http://localhost:${PORT}/api/records/upload`);
});
