import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { AppError } from './errorHandler.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Magic Number (File Signature) Validation
 * Validates file type by checking actual file header bytes
 * Prevents MIME type spoofing attacks
 */
const validateMagicNumber = async (filePath) => {
  try {
    const buffer = await fs.readFile(filePath);
    const header = buffer.slice(0, 4).toString('hex').toUpperCase();

    // Check magic numbers
    const signatures = {
      'FFD8FFE0': 'image/jpeg', // JPEG (JFIF)
      'FFD8FFE1': 'image/jpeg', // JPEG (Exif)
      'FFD8FFDB': 'image/jpeg', // JPEG (Standard)
      'FFD8FFEE': 'image/jpeg', // JPEG (SPIFF)
      '89504E47': 'image/png',  // PNG
      '25504446': 'application/pdf', // PDF
    };

    // Exact match
    if (signatures[header]) {
      return { valid: true, type: signatures[header] };
    }

    // Partial match for JPEG variants
    if (header.startsWith('FFD8FF')) {
      return { valid: true, type: 'image/jpeg' };
    }

    return { valid: false, type: null };
  } catch (error) {
    console.error('Magic number validation error:', error);
    return { valid: false, type: null };
  }
};

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

/**
 * Middleware to validate uploaded file magic numbers (file signatures)
 * Call this AFTER multer has saved the file
 */
export const validateUploadedFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    // Validate magic number
    const validation = await validateMagicNumber(req.file.path);

    if (!validation.valid) {
      // Delete the invalid file
      await fs.unlink(req.file.path).catch(err => console.error('Error deleting invalid file:', err));

      return next(
        new AppError(
          'File validation failed. The file appears to be corrupted or is not a valid image/PDF.',
          400
        )
      );
    }

    // Verify magic number matches MIME type
    const allowedMatches = {
      'image/jpeg': 'image/jpeg',
      'image/jpg': 'image/jpeg',
      'image/png': 'image/png',
      'application/pdf': 'application/pdf',
    };

    if (allowedMatches[req.file.mimetype] !== validation.type) {
      // Delete the mismatched file
      await fs.unlink(req.file.path).catch(err => console.error('Error deleting mismatched file:', err));

      return next(
        new AppError(
          'File type mismatch. The file extension does not match the actual file content.',
          400
        )
      );
    }

    // File is valid, continue
    next();
  } catch (error) {
    console.error('File validation middleware error:', error);

    // Clean up file on error
    if (req.file && req.file.path) {
      await fs.unlink(req.file.path).catch(err => console.error('Error deleting file:', err));
    }

    next(new AppError('File validation failed', 500));
  }
};
