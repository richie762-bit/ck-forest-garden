import { prisma } from '../config/database.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import {
  generateBookingReference,
  calculateNumberOfDays,
  calculateTotalAmount,
  successResponse,
} from '../utils/helpers.js';
import {
  sendBookingConfirmationEmail,
  sendAdminNotificationEmail,
  sendPaymentReceiptNotification,
} from '../services/emailService.js';

/**
 * @desc    Get confirmed booking dates (for blocking in calendar)
 * @route   GET /api/bookings/blocked-dates
 * @access  Public
 */
export const getBlockedDates = asyncHandler(async (req, res) => {
  // Get all confirmed bookings
  const confirmedBookings = await prisma.booking.findMany({
    where: {
      bookingStatus: 'confirmed',
    },
    select: {
      dateFrom: true,
      dateTo: true,
    },
  });

  res.status(200).json(
    successResponse(
      confirmedBookings,
      'Blocked dates retrieved successfully'
    )
  );
});

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Public
 */
export const createBooking = asyncHandler(async (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    bookingType,
    numberOfAdults,
    numberOfChildren = 0,
    dateFrom,
    dateTo,
  } = req.body;

  // Calculate number of days
  const numberOfDays = calculateNumberOfDays(dateFrom, dateTo);

  // Validate minimum days
  if (numberOfDays < 1) {
    throw new AppError('Booking must be for at least 1 day', 400);
  }

  // Check for overlapping confirmed bookings
  // Allow same-day turnover: one booking can end on the same day another begins
  // Allow single-day bookings: start and end on the same day
  const requestedDateFrom = new Date(dateFrom);
  const requestedDateTo = new Date(dateTo);

  const overlappingBookings = await prisma.booking.findMany({
    where: {
      bookingStatus: 'confirmed',
      AND: [
        // Requested start date is before or equal to existing end date
        { dateTo: { gte: requestedDateFrom } },
        // Requested end date is after or equal to existing start date
        { dateFrom: { lte: requestedDateTo } },
      ],
    },
  });

  if (overlappingBookings.length > 0) {
    throw new AppError(
      'Selected dates overlap with a confirmed booking. Please choose different dates.',
      400
    );
  }

  // Calculate total amount
  const ratePerAdultPerDay = 5000; // GYD 5,000 per adult per day
  const totalAmount = calculateTotalAmount(numberOfAdults, numberOfDays, ratePerAdultPerDay);

  // Generate unique booking reference
  const bookingReference = generateBookingReference();

  // Create booking in database
  const booking = await prisma.booking.create({
    data: {
      bookingReference,
      customerName,
      customerEmail,
      customerPhone,
      bookingType,
      numberOfAdults,
      numberOfChildren,
      dateFrom: new Date(dateFrom),
      dateTo: new Date(dateTo),
      numberOfDays,
      ratePerAdultPerDay,
      totalAmount,
      bookingStatus: 'pending',
      paymentStatus: 'pending',
    },
  });

  // Send confirmation email to customer (non-blocking)
  sendBookingConfirmationEmail(booking).catch((err) =>
    console.error('Email error:', err)
  );

  // Send notification email to admin (non-blocking)
  sendAdminNotificationEmail(booking).catch((err) =>
    console.error('Admin notification error:', err)
  );

  res.status(201).json(
    successResponse(
      booking,
      'Booking created successfully. Please upload payment receipt to confirm.'
    )
  );
});

/**
 * @desc    Get booking by reference
 * @route   GET /api/bookings/:reference
 * @access  Public
 */
export const getBookingByReference = asyncHandler(async (req, res) => {
  const { reference } = req.params;

  const booking = await prisma.booking.findUnique({
    where: { bookingReference: reference },
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  res.status(200).json(successResponse(booking, 'Booking retrieved successfully'));
});

/**
 * @desc    Upload payment receipt for a booking
 * @route   POST /api/bookings/:id/upload
 * @access  Public
 */
export const uploadPaymentReceipt = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if file was uploaded
  if (!req.file) {
    throw new AppError('Please upload a payment receipt', 400);
  }

  // Find booking
  const booking = await prisma.booking.findUnique({
    where: { id: parseInt(id) },
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Update booking with receipt path
  const updatedBooking = await prisma.booking.update({
    where: { id: parseInt(id) },
    data: {
      paymentReceiptPath: req.file.filename,
    },
  });

  // Send payment receipt notification to customer (non-blocking)
  sendPaymentReceiptNotification(updatedBooking).catch((err) =>
    console.error('Email error:', err)
  );

  res.status(200).json(
    successResponse(
      {
        booking: updatedBooking,
        receiptUrl: `/uploads/receipts/${req.file.filename}`,
      },
      'Payment receipt uploaded successfully'
    )
  );
});
