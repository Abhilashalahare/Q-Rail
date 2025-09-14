import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import vendorRoutes from "./routes/vendorRoutes.js";
import partRoutes from "./routes/partRoutes.js";
import qrRoutes from "./routes/qrRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();
app.use(cors({
  origin: "http://localhost:5173",  // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

connectDB();

app.use("/api/vendor", vendorRoutes);
app.use("/api/part", partRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/qr", qrRoutes);



const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
