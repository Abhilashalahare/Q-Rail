import Part from "../models/part.js";

// Vendor creates part
export const createPart = async (req, res) => {
  try {
    const { type, lotNumber, quantity, supplyDate, warrantyYears } = req.body;
    const vendorId = req.user.id;  // from auth middleware

    const part = await Part.create({
      type,
      lotNumber,
      quantity,
      supplyDate,
      warrantyYears,
      vendor: vendorId
    });

    res.status(201).json({ message: "Part added", part });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch by part type
export const getPartsByType = async (req, res) => {
  try {
    const type = req.params.type.toLowerCase();
    const parts = await Part.find({ type }).populate("vendor", "name email");
    res.json(parts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all parts (for admin)
export const getAllParts = async (req, res) => {
  try {
    const parts = await Part.find().populate("vendor", "name email");
    res.json(parts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
