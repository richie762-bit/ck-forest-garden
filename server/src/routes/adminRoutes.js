import express from 'express';
import {
  adminLogin,
  getDashboardStats,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getCurrentAdmin,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import {
  validate,
  loginSchema,
  updateBookingStatusSchema,
  queryParamsSchema,
} from '../middleware/validation.js';

const router = express.Router();

/**
 * Public Admin Routes
 */

// Admin login
router.post('/login', validate(loginSchema), adminLogin);

/**
 * Protected Admin Routes
 * All routes below require authentication
 */

// Get current admin user info
router.get('/me', protect, authorize('admin'), getCurrentAdmin);

// Get dashboard statistics
router.get('/dashboard', protect, authorize('admin'), getDashboardStats);

// Get all bookings with filters and pagination
router.get(
  '/bookings',
  protect,
  authorize('admin'),
  validate(queryParamsSchema, 'query'),
  getAllBookings
);

// Get single booking by ID
router.get('/bookings/:id', protect, authorize('admin'), getBookingById);

// Update booking status
router.patch(
  '/bookings/:id',
  protect,
  authorize('admin'),
  validate(updateBookingStatusSchema),
  updateBookingStatus
);

// Cancel booking
router.delete('/bookings/:id', protect, authorize('admin'), cancelBooking);

export default router;
