import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import archiver from "archiver";
import QRCode from "qrcode";
import PartQR from "../models/partQR.js";
import PDFDocument from "pdfkit";
import { getPartPrefix, generateCode } from "../utils/codeGenerator.js";

const uploadDir = path.resolve("uploads");

// Generate URL format: /RC/202509-004
const generateQRUrl = (partType, manufactureDate, serialNo, baseUrl = process.env.BASE_URL || "http://localhost:5000") => {
  const prefix = getPartPrefix(partType);
  const date = new Date(manufactureDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const code = String(serialNo).padStart(3, '0');
  
  return `${baseUrl}/${prefix}/${year}${month}-${code}`;
};

// Ensure upload dir exists
const ensureDir = async () => {
  if (!fs.existsSync(uploadDir)) await fsp.mkdir(uploadDir, { recursive: true });
};

// Cleanup helper
const cleanupFiles = async (files) => {
  for (const f of files) {
    try { 
      await fsp.unlink(f); 
    } catch (error) {
      console.warn(`Failed to cleanup ${f}:`, error.message);
    }
  }
};

// Generate a PDF containing ONLY the unique code as QR (exactly like your image)
const generateQRPDF = async (uniqueCode, qrUrl) => {
  const pdfPath = path.join(uploadDir, `${uniqueCode}.pdf`);
  
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        margin: 50,
        size: 'A4'
      });
      const writeStream = fs.createWriteStream(pdfPath);
      doc.pipe(writeStream);

      // Add some top margin
      doc.moveDown(3);

      // Code at the top (exactly like your format) - LARGER FONT
      doc.fontSize(28).text(`Code: ${uniqueCode}`, { align: "center" });
      doc.moveDown(4);

      // Generate QR code containing the URL for scanning
      const qrBuffer = await QRCode.toBuffer(qrUrl, { 
        width: 600,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      
      // Center the QR code
      const qrSize = 350;
      const qrX = (doc.page.width - qrSize) / 2;
      doc.image(qrBuffer, qrX, doc.y, { width: qrSize, height: qrSize });

      doc.end();

      writeStream.on("finish", () => resolve(pdfPath));
      writeStream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};

// Generate ZIP of PDFs containing only QR codes
export const generateQRZip = async (req, res) => {
  let tempFiles = [];
  let zipPath = null;

  try {
    const {
      partType,
      startId,
      endId,
      manufactureDate,
      lotNo,
      manufacturerName,
      warrantyYears,
      expiryDate
    } = req.body;

    // Input validation
    if (!partType || startId === undefined || endId === undefined) {
      return res.status(400).json({ 
        error: "Missing required fields: partType, startId, endId" 
      });
    }

    if (!manufactureDate || !lotNo || !manufacturerName || !warrantyYears || !expiryDate) {
      return res.status(400).json({ 
        error: "Missing required fields: manufactureDate, lotNo, manufacturerName, warrantyYears, expiryDate" 
      });
    }

    if (startId > endId) {
      return res.status(400).json({ 
        error: "startId must be less than or equal to endId" 
      });
    }

    if (endId - startId > 1000) {
      return res.status(400).json({ 
        error: "Maximum 1000 QR codes can be generated at once" 
      });
    }

    await ensureDir();

    // Prepare ZIP file
    const timestamp = Date.now();
    const zipName = `QRCodes_${partType.replace(/\s+/g, '_')}_${startId}-${endId}_${timestamp}.zip`;
    zipPath = path.join(uploadDir, zipName);

    console.log(`Generating ${endId - startId + 1} QR codes for ${partType}...`);

    // Store vendor details once - they apply to all QR codes in this batch
    const vendorDetails = {
      partType,
      manufactureDate,
      lotNo,
      manufacturerName,
      warrantyYears,
      expiryDate,
      batchId: `BATCH_${timestamp}`, // Unique batch identifier
      createdAt: new Date()
    };

    // Generate QR codes for each serial number
    for (let i = startId; i <= endId; i++) {
      // Generate unique code using your utility function
      const uniqueCode = generateCode(partType, manufactureDate, i);
      
      // Generate QR URL (what the QR actually contains when scanned)
      const qrUrl = generateQRUrl(partType, manufactureDate, i);

      console.log(`Generating: Code=${uniqueCode}, URL=${qrUrl}`); // Debug log

      // Save to Database - store the unique code with vendor details
      try {
        await PartQR.create({
          uuid: uniqueCode,
          code: uniqueCode,
          serialNo: i,
          url: qrUrl, // Changed from qrUrl to url to match your model
          ...vendorDetails // Spread all vendor details
        });
        console.log(`Saved to DB: ${uniqueCode} -> ${qrUrl}`);
      } catch (err) {
        if (err.code === 11000) {
          console.warn(`Duplicate entry skipped for ${uniqueCode}`);
        } else {
          console.error(`Database error for ${uniqueCode}:`, err.message);
        }
      }

      // Generate PDF with QR code that contains the URL
      try {
        const pdfPath = await generateQRPDF(uniqueCode, qrUrl);
        tempFiles.push(pdfPath);
        console.log(`Generated PDF: ${uniqueCode}.pdf`);
      } catch (pdfError) {
        console.error(`PDF generation failed for ${uniqueCode}:`, pdfError.message);
      }
    }

    if (tempFiles.length === 0) {
      return res.status(500).json({ 
        error: "No PDFs were generated successfully" 
      });
    }

    // Create ZIP file
    console.log("Creating ZIP archive...");
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { 
      zlib: { level: 9 },
      forceLocalTime: true
    });

    // Setup promises for proper async handling
    const outputPromise = new Promise((resolve, reject) => {
      output.on("close", () => {
        console.log(`ZIP finalized: ${archive.pointer()} bytes`);
        resolve();
      });
      output.on("error", reject);
    });

    const archivePromise = new Promise((resolve, reject) => {
      archive.on("error", reject);
      archive.on("end", resolve);
    });

    archive.pipe(output);

    // Add all PDF files to the archive
    console.log(`Adding ${tempFiles.length} files to ZIP...`);
    for (let index = 0; index < tempFiles.length; index++) {
      const file = tempFiles[index];
      const fileName = path.basename(file);
      console.log(`Adding file ${index + 1}/${tempFiles.length}: ${fileName}`);
      archive.file(file, { name: fileName });
    }

    // Finalize the archive and wait for completion
    console.log("Finalizing archive...");
    archive.finalize();
    
    // Wait for both the archive to finish and output to close
    await Promise.all([archivePromise, outputPromise]);
    console.log(`ZIP created successfully: ${zipName}`);

    // Send response with download
    res.download(zipPath, zipName, async (downloadError) => {
      if (downloadError) {
        console.error("Download error:", downloadError);
      }
      
      console.log("Cleaning up temporary files...");
      await cleanupFiles([...tempFiles, zipPath]);
      console.log("Cleanup completed");
    });

  } catch (error) {
    console.error("QR generation error:", error);
    
    // Cleanup on error
    if (tempFiles.length > 0) {
      await cleanupFiles(tempFiles);
    }
    if (zipPath) {
      await cleanupFiles([zipPath]);
    }

    if (!res.headersSent) {
      res.status(500).json({ 
        error: "QR generation failed", 
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
};

// Handle QR scan - when someone scans the QR code
export const handleQRScan = async (req, res) => {
  try {
    const { partPrefix, yearMonthCode } = req.params;
    
    // Reconstruct the full code from URL parameters
    // URL: /RC/202509-004 -> Code: RC-202509-004
    const fullCode = `${partPrefix.toUpperCase()}-${yearMonthCode}`;
    
    const partData = await PartQR.findOne({ 
      $or: [
        { uuid: fullCode },
        { code: fullCode }
      ]
    });
    
    if (!partData) {
      return res.status(404).json({ 
        error: "Part not found",
        message: "This QR code is not registered in our system",
        scannedCode: fullCode
      });
    }

    // Return all part details when QR is scanned
    res.json({
      success: true,
      message: "Part details retrieved successfully",
      data: {
        code: partData.code,
        partType: partData.partType,
        serialNo: partData.serialNo,
        manufacturerName: partData.manufacturerName,
        manufactureDate: partData.manufactureDate,
        lotNo: partData.lotNo,
        warrantyYears: partData.warrantyYears,
        expiryDate: partData.expiryDate,
        batchId: partData.batchId,
        createdAt: partData.createdAt
      },
      scannedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("QR scan error:", error);
    res.status(500).json({ 
      error: "Failed to process QR scan", 
      details: error.message 
    });
  }
};

// Optional: Get all parts in a batch
export const getBatchDetails = async (req, res) => {
  try {
    const { batchId } = req.params;
    
    const parts = await PartQR.find({ batchId }).sort({ serialNo: 1 });
    
    if (parts.length === 0) {
      return res.status(404).json({ error: "Batch not found" });
    }

    res.json({
      success: true,
      batchId,
      totalParts: parts.length,
      parts
    });
    
  } catch (error) {
    console.error("Error fetching batch details:", error);
    res.status(500).json({ 
      error: "Failed to fetch batch details", 
      details: error.message 
    });
  }
};

// Test endpoint to debug QR generation
export const testQRGeneration = async (req, res) => {
  try {
    const testData = {
      partType: "Rail Clip",
      manufactureDate: "2025-09-15",
      serialNo: 1
    };

    const code = generateCode(testData.partType, testData.manufactureDate, testData.serialNo);
    const prefix = getPartPrefix(testData.partType);
    const qrUrl = generateQRUrl(testData.partType, testData.manufactureDate, testData.serialNo);

    res.json({
      success: true,
      debug: {
        partType: testData.partType,
        prefix: prefix,
        code: code,
        qrUrl: qrUrl,
        expectedFormat: "RC-202509-001",
        baseUrl: process.env.BASE_URL || "http://localhost:5000"
      }
    });
  } catch (error) {
    console.error("Test error:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};