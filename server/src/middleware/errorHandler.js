import { ZodError } from 'zod';

/**
 * Custom Application Error Class
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Error Handler Middleware
 * Handles all errors thrown in the application
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  // Zod Validation Error
  if (err instanceof ZodError) {
    const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    error = new AppError(message, 400);
  }

  // Prisma Errors
  if (err.code === 'P2002') {
    // Unique constraint violation
    const field = err.meta?.target?.[0] || 'field';
    error = new AppError(`${field} already exists`, 409);
  }

  if (err.code === 'P2025') {
    // Record not found
    error = new AppError('Record not found', 404);
  }

  if (err.code === 'P2003') {
    // Foreign key constraint
    error = new AppError('Invalid reference to related record', 400);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please login again', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired. Please login again', 401);
  }

  // Multer Errors (File Upload)
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = new AppError('File size too large. Maximum 5MB allowed', 400);
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      error = new AppError('Unexpected file field', 400);
    } else {
      error = new AppError(`File upload error: ${err.message}`, 400);
    }
  }

  // Send error response
  res.status(error.statusCode).json({
    status: error.status || 'error',
    message: error.message || 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && {
      error: err,
      stack: err.stack,
    }),
  });
};

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
