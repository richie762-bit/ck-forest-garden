import { z } from 'zod';

/**
 * Booking Form Validation Schema
 */
export const bookingSchema = z
  .object({
    customerName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters'),
    customerEmail: z
      .string()
      .email('Invalid email address')
      .max(100, 'Email must not exceed 100 characters'),
    customerPhone: z
      .string()
      .min(7, 'Phone number must be exactly 7 digits')
      .max(7, 'Phone number must be exactly 7 digits')
      .regex(/^\d{7}$/, 'Phone number must be exactly 7 digits'),
    bookingType: z
      .string()
      .min(1, 'Please select a booking type'),
    numberOfAdults: z
      .number({
        required_error: 'Number of adults is required',
        invalid_type_error: 'Number of adults must be a number',
      })
      .int('Number of adults must be a whole number')
      .min(10, 'Minimum 10 adults required')
      .max(500, 'Maximum 500 adults allowed'),
    numberOfChildren: z
      .number({
        invalid_type_error: 'Number of children must be a number',
      })
      .int('Number of children must be a whole number')
      .min(0, 'Number of children cannot be negative')
      .max(500, 'Maximum 500 children allowed')
      .default(0),
    dateFrom: z
      .string()
      .min(1, 'Start date is required')
      .refine((date) => {
        const selected = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected >= today;
      }, 'Start date cannot be in the past'),
    dateTo: z
      .string()
      .min(1, 'End date is required'),
  })
  .refine(
    (data) => {
      const start = new Date(data.dateFrom);
      const end = new Date(data.dateTo);
      return end >= start;
    },
    {
      message: 'End date cannot be before start date',
      path: ['dateTo'],
    }
  );

/**
 * Admin Login Validation Schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(100, 'Email must not exceed 100 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters'),
});

/**
 * Magic Number (File Signature) Validation
 * Validates file type by checking the actual file header bytes
 * This prevents MIME type spoofing attacks
 */
const validateMagicNumber = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onloadend = (e) => {
      if (!e.target.result) {
        resolve({ valid: false, type: null });
        return;
      }

      const arr = new Uint8Array(e.target.result).subarray(0, 4);
      let header = '';
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16).padStart(2, '0');
      }

      // Check magic numbers (file signatures)
      let fileType = null;
      switch (header.toUpperCase()) {
        case 'FFD8FFE0': // JPEG (JFIF)
        case 'FFD8FFE1': // JPEG (Exif)
        case 'FFD8FFDB': // JPEG (Standard)
        case 'FFD8FFEE': // JPEG (SPIFF)
          fileType = 'image/jpeg';
          break;
        case '89504E47': // PNG
          fileType = 'image/png';
          break;
        case '25504446': // PDF
          fileType = 'application/pdf';
          break;
        default:
          // Check for partial matches
          if (header.startsWith('FFD8FF')) {
            fileType = 'image/jpeg';
          }
          break;
      }

      resolve({ valid: !!fileType, type: fileType });
    };

    reader.onerror = () => {
      resolve({ valid: false, type: null });
    };

    // Read first 4 bytes
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
};

/**
 * File Upload Validation with Magic Number Check
 * Validates both MIME type and actual file signature (magic numbers)
 */
export const validateFileUpload = async (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

  if (!file) {
    return { success: false, error: 'No file selected' };
  }

  if (file.size > maxSize) {
    return { success: false, error: 'File size must be less than 5MB' };
  }

  // Check MIME type (first line of defense)
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: 'Only JPG, PNG, and PDF files are allowed' };
  }

  // Check magic number (file signature) to prevent MIME spoofing
  const magicCheck = await validateMagicNumber(file);
  if (!magicCheck.valid) {
    return {
      success: false,
      error: 'File validation failed. The file appears to be corrupted or is not a valid image/PDF file.'
    };
  }

  // Verify magic number matches declared MIME type
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    if (magicCheck.type !== 'image/jpeg') {
      return {
        success: false,
        error: 'File type mismatch. The file extension does not match the actual file content.'
      };
    }
  } else if (file.type === 'image/png' && magicCheck.type !== 'image/png') {
    return {
      success: false,
      error: 'File type mismatch. The file extension does not match the actual file content.'
    };
  } else if (file.type === 'application/pdf' && magicCheck.type !== 'application/pdf') {
    return {
      success: false,
      error: 'File type mismatch. The file extension does not match the actual file content.'
    };
  }

  return { success: true, error: null };
};
