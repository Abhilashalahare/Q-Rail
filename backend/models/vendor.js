import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["vendor","admin"], default: "vendor" }
}, { timestamps: true });

export default mongoose.model("Vendor", vendorSchema);
