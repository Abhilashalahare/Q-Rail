import express from "express";
import { createPart, getPartsByType, getAllParts } from "../controllers/partController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// Vendor adds part
router.post("/", authMiddleware, createPart);

// Get all parts of a specific type
router.get("/:type", getPartsByType);

// (Optional) Admin - get all parts
router.get("/", getAllParts);

export default router;
