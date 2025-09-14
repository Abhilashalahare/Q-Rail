import mongoose from "mongoose";

const partQRSchema = new mongoose.Schema({
  uuid: { type: String, unique: true, required: true },    // unique key (for internal DB use)
  code: { type: String, unique: true, required: true },    // the human-readable code, e.g., RC-202509-001
  partType: { type: String, required: true },
  manufactureDate: { type: Date, required: true },
  lotNo: { type: String, required: true },
  serialNo: { type: Number, required: true },
  
  manufacturerName: { type: String, required: true },
  warrantyYears: { type: Number, required: true },
  expiryDate: { type: Date, required: true },

  url: { type: String, required: true } // QR code URL pointing to dynamic route
}, { timestamps: true });

export default mongoose.model("PartQR", partQRSchema);
