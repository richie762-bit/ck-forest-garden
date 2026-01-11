import { z } from 'zod';

/**
 * Server-Side Input Validation Middleware
 * Validates request bodies against Zod schemas
 */

/**
 * Booking validation schema (server-side)
 */
export const bookingValidationSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  customerEmail: z
    .string()
    .email('Invalid email address')
    .max(100, 'Email must not exceed 100 characters')
    .toLowerCase(),
  customerPhone: z
    .string()
    .min(7, 'Phone number must be exactly 7 digits')
    .max(7, 'Phone number must be exactly 7 digits')
    .regex(/^\d{7}$/, 'Phone number must be exactly 7 digits'),
  bookingType: z
    .string()
    .min(1, 'Booking type is required'),
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
    .datetime('Invalid date format'),
  dateTo: z
    .string()
    .min(1, 'End date is required')
    .datetime('Invalid date format'),
}).refine(
  (data) => {
    const start = new Date(data.dateFrom);
    const end = new Date(data.dateTo);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate start date is not in the past
    if (start < today) {
      return false;
    }

    // Validate end date is after start date
    return end >= start;
  },
  {
    message: 'Invalid date range',
    path: ['dateTo'],
  }
);

/**
 * Gallery image validation schema
 */
export const galleryImageValidationSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must not exceed 200 characters')
    .regex(/^[a-zA-Z0-9\s\-_,.!?'"()]+$/, 'Title contains invalid characters'),
  caption: z
    .string()
    .max(500, 'Caption must not exceed 500 characters')
    .optional(),
  category: z
    .string()
    .max(50, 'Category must not exceed 50 characters')
    .optional(),
  displayOrder: z
    .number()
    .int()
    .min(0)
    .optional(),
});

/**
 * Admin login validation schema
 */
export const loginValidationSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(100, 'Email must not exceed 100 characters')
    .toLowerCase(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters'),
});

/**
 * Validation middleware factory
 * Creates middleware that validates request body against a Zod schema
 */
export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      // Parse and validate
      const validated = await schema.parseAsync(req.body);

      // Replace body with validated (and potentially transformed) data
      req.body = validated;

      next();
    } catch (error) {
      // Zod validation error
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors,
        });
      }

      // Other errors
      next(error);
    }
  };
};

/**
 * Sanitize string input to prevent XSS
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;

  return str
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
};

/**
 * Sanitize object recursively
 */
export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const sanitized = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Middleware to sanitize request body
 */
export const sanitizeInput = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};
