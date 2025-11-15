import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { AppError } from './errorHandler.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configure Multer Storage
 * Saves files with unique names in uploads/receipts/
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/receipts'));
  },
  filename: (req, file, cb) => {
    // Generate unique filename: receipt-{timestamp}-{random}.{ext}
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const ext = path.extname(file.originalname);
    cb(null, `receipt-${uniqueSuffix}${ext}`);
  },
});

/**
 * File Filter - Accept only images and PDFs
 */
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Invalid file type. Only JPG, PNG, and PDF files are allowed',
        400
      ),
      false
    );
  }
};

/**
 * Multer Upload Configuration
 * Max file size: 5MB
 */
export const uploadReceipt = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
});

/**
 * Single file upload middleware
 */
export const uploadSingleReceipt = uploadReceipt.single('receipt');
