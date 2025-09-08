import Vendor from "../models/vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerVendor = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await Vendor.findOne({ email });
    if (existing) return res.status(400).json({ message: "Vendor already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const vendor = await Vendor.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "Vendor registered", vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginVendor = async (req, res) => {
  const { email, password } = req.body;
  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(400).json({ message: "Vendor not found" });

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: vendor._id, role: vendor.role }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1d" });
    res.json({ token, vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
