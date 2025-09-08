import mongoose from "mongoose";

const partSchema = new mongoose.Schema({
  type: { type: String, required: true }, // any string allowed now
  lotNumber: { type: String, required: true },
  quantity: { type: Number, required: true },
  supplyDate: { type: Date, required: true },
  warrantyYears: { type: Number, default: 2 },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },  //MongoDB assigns a unique ID (_id) to every document automatically.
}, { timestamps: true });

export default mongoose.model("Part", partSchema);
