import dotenv from "dotenv";
dotenv.config();
// Core
import express from "express";
import cors from "cors";
// Networking
import fetch from "node-fetch";
// Upload & forms
import multer from "multer";
import FormData from "form-data";
// Security
import rateLimit from "express-rate-limit";

const app = express();
app.use(cors());

const upload = multer();

const removeBgLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // max 15 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend API is working",
  });
});

app.post(
  "/api/remove-bg",
  removeBgLimiter,
  upload.single("image_file"),
  async (req, res) => {
    try {
      const formData = new FormData();
      formData.append("image_file", req.file.buffer, req.file.originalname);
      formData.append("size", "auto");

      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": process.env.API_KEY,
        },
        body: formData,
      });

      const buffer = await response.arrayBuffer();
      res.set("Content-Type", "image/png");
      res.send(Buffer.from(buffer));
    } catch (err) {
      res.status(500).json({ error: "Background removal failed" });
    }
  }
);
app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
