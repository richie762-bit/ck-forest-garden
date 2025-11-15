import express from 'express';
import {
  createBooking,
  getBookingByReference,
  uploadPaymentReceipt,
  getBlockedDates,
} from '../controllers/bookingController.js';
import { uploadSingleReceipt } from '../middleware/upload.js';
import { validate, createBookingSchema } from '../middleware/validation.js';

const router = express.Router();

/**
 * Public Booking Routes
 */

// Get blocked dates (confirmed bookings) - MUST BE BEFORE /:reference route
router.get('/blocked-dates', getBlockedDates);

// Create a new booking
router.post('/', validate(createBookingSchema), createBooking);

// Get booking by reference number
router.get('/:reference', getBookingByReference);

// Upload payment receipt for a booking
router.post('/:id/upload', uploadSingleReceipt, uploadPaymentReceipt);

export default router;
