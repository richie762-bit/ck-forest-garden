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
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

/**
 * File Upload Validation
 */
export const validateFileUpload = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

  if (!file) {
    return { success: false, error: 'No file selected' };
  }

  if (file.size > maxSize) {
    return { success: false, error: 'File size must be less than 5MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: 'Only JPG, PNG, and PDF files are allowed' };
  }

  return { success: true, error: null };
};
