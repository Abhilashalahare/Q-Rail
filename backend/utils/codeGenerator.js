export const getPartPrefix = (partType) => {
  const mapping = {
    "Rail Clip": "RC",
    "Rail Pad": "RP",
    "Elastic Rail Clip": "ERC",
    "Fish Plate": "FP",
    "Base Plate": "BP"
  };
  return mapping[partType] || "PT"; // fallback
};

export const generateCode = (partType, manufactureDate, serialNo) => {
  const prefix = getPartPrefix(partType);
  const dateObj = new Date(manufactureDate);
  const yearMonth = `${dateObj.getFullYear()}${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
  const serialPadded = String(serialNo).padStart(3, "0");
  return `${prefix}-${yearMonth}-${serialPadded}`;
};
