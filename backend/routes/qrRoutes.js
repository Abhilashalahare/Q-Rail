// routes/qr.js
import express from 'express';
import { generateQRZip, handleQRScan, getBatchDetails, testQRGeneration } from '../controllers/qrController.js';

const router = express.Router();

router.post('/generate-zip', generateQRZip);
router.get('/test-qr', testQRGeneration);
router.get('/:partPrefix/:yearMonthCode', handleQRScan);
router.get('/batch/:batchId', getBatchDetails);

export default router;