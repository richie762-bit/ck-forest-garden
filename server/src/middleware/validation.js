import { z } from 'zod';
import { AppError } from './errorHandler.js';

/**
 * Validation Middleware Factory
 * Validates request body, query, or params against a Zod schema
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const data = req[source];
      schema.parse(data);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', ');
        throw new AppError(message, 400);
      }
      next(error);
    }
  };
};

/**
 * Booking Validation Schema
 */
export const createBookingSchema = z.object({
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
    .length(7, 'Phone number must be exactly 7 digits')
    .regex(/^\d{7}$/, 'Phone number must contain exactly 7 digits'),
  bookingType: z
    .string()
    .min(1, 'Booking type is required')
    .max(50, 'Booking type must not exceed 50 characters'),
  numberOfAdults: z
    .number()
    .int('Number of adults must be a whole number')
    .min(10, 'Minimum 10 adults required')
    .max(500, 'Maximum 500 adults allowed'),
  numberOfChildren: z
    .number()
    .int('Number of children must be a whole number')
    .min(0, 'Number of children cannot be negative')
    .max(500, 'Maximum 500 children allowed')
    .default(0),
  dateFrom: z
    .string()
    .datetime('Invalid date format')
    .transform((str) => new Date(str))
    .refine((date) => date > new Date(), 'Date from must be in the future'),
  dateTo: z
    .string()
    .datetime('Invalid date format')
    .transform((str) => new Date(str)),
}).refine(
  (data) => {
    return data.dateTo >= data.dateFrom;
  },
  {
    message: 'Date to cannot be before date from',
    path: ['dateTo'],
  }
);

/**
 * Admin Login Validation Schema
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Update Booking Status Validation Schema
 */
export const updateBookingStatusSchema = z.object({
  bookingStatus: z
    .enum(['pending', 'confirmed', 'completed', 'cancelled'], {
      errorMap: () => ({
        message: 'Status must be pending, confirmed, completed, or cancelled',
      }),
    })
    .optional(),
  paymentStatus: z
    .enum(['pending', 'paid'], {
      errorMap: () => ({ message: 'Payment status must be pending or paid' }),
    })
    .optional(),
  cancellationReason: z.string().max(500).optional(),
});

/**
 * Query Parameters Validation Schema (for filtering/pagination)
 */
export const queryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, 'Page must be greater than 0'),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100'),
  search: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
  dateFrom: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
  dateTo: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
});
