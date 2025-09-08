import express from "express";
import { generateQRCodePDF } from "../controllers/qrController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// Protected route: only logged-in vendors can generate QR
router.post("/generate", authMiddleware, generateQRCodePDF);

export default router;
