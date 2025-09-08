import QRCode from "qrcode";
import PDFDocument from "pdfkit";
import { v4 as uuidv4 } from "uuid";

export const generateQRCodePDF = async (req, res) => {
    try {
        const { partType, manufactureDate, lotNo } = req.body;
        if (!partType || !manufactureDate || !lotNo) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const uniqueId = uuidv4();

        // ✅ Encode website URL in QR
        const baseUrl = "https://www.ir-fittings.in";
        const qrData = `${baseUrl}/${partType.toLowerCase()}`;
        const qrImage = await QRCode.toDataURL(qrData);

        const doc = new PDFDocument();
        const fileName = `QR_${partType}_${lotNo}.pdf`;
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
        doc.pipe(res);

        doc.fontSize(20).text("Railway Track Fitting QR", { align: "center" });
        doc.moveDown();
        doc.fontSize(16).text(`Part Type: ${partType}`);
        doc.text(`Manufacture Date: ${manufactureDate}`);
        doc.text(`Lot Number: ${lotNo}`);
        doc.text(`Unique ID: ${uniqueId}`);
        doc.moveDown();

        const base64Data = qrImage.replace(/^data:image\/png;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        doc.image(buffer, { align: "center", width: 200, height: 200 });

        doc.end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error generating QR" });
    }
};
