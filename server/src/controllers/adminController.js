import bcrypt from 'bcrypt';
import { prisma } from '../config/database.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { generateToken } from '../middleware/auth.js';
import {
  successResponse,
  getPaginationParams,
  getPaginationMeta,
  buildBookingFilters,
} from '../utils/helpers.js';

/**
 * @desc    Admin login
 * @route   POST /api/admin/login
 * @access  Public
 */
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate JWT token
  const token = generateToken(user.id);

  // Return user info and token (exclude password)
  const { password: _, ...userWithoutPassword } = user;

  res.status(200).json(
    successResponse(
      {
        user: userWithoutPassword,
        token,
      },
      'Login successful'
    )
  );
});

/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin)
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  // Get total bookings count
  const totalBookings = await prisma.booking.count();

  // Get bookings by status
  const pendingBookings = await prisma.booking.count({
    where: { bookingStatus: 'pending' },
  });

  const confirmedBookings = await prisma.booking.count({
    where: { bookingStatus: 'confirmed' },
  });

  const completedBookings = await prisma.booking.count({
    where: { bookingStatus: 'completed' },
  });

  const cancelledBookings = await prisma.booking.count({
    where: { bookingStatus: 'cancelled' },
  });

  // Calculate total revenue (confirmed + completed bookings)
  const revenueResult = await prisma.booking.aggregate({
    where: {
      bookingStatus: {
        in: ['confirmed', 'completed'],
      },
    },
    _sum: {
      totalAmount: true,
    },
  });

  const totalRevenue = revenueResult._sum.totalAmount || 0;

  // Calculate pending revenue (pending bookings)
  const pendingRevenueResult = await prisma.booking.aggregate({
    where: {
      bookingStatus: 'pending',
    },
    _sum: {
      totalAmount: true,
    },
  });

  const pendingRevenue = pendingRevenueResult._sum.totalAmount || 0;

  // Get recent bookings (last 5)
  const recentBookingsRaw = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      bookingReference: true,
      customerName: true,
      bookingType: true,
      totalAmount: true,
      bookingStatus: true,
      createdAt: true,
      paymentReceiptPath: true,
    },
  });

  // Add receipt URLs to recent bookings
  const recentBookings = recentBookingsRaw.map((booking) => ({
    ...booking,
    paymentReceiptUrl: booking.paymentReceiptPath
      ? `/uploads/receipts/${booking.paymentReceiptPath}`
      : null,
  }));

  // Get bookings by month (current year)
  const currentYear = new Date().getFullYear();
  const bookingsByMonth = await prisma.$queryRaw`
    SELECT
      EXTRACT(MONTH FROM "createdAt") as month,
      COUNT(*)::int as count,
      SUM("totalAmount")::int as revenue
    FROM bookings
    WHERE EXTRACT(YEAR FROM "createdAt") = ${currentYear}
    GROUP BY EXTRACT(MONTH FROM "createdAt")
    ORDER BY month
  `;

  const stats = {
    overview: {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
      pendingRevenue,
    },
    recentBookings,
    bookingsByMonth,
  };

  res.status(200).json(successResponse(stats, 'Dashboard stats retrieved successfully'));
});

/**
 * @desc    Get all bookings with filters and pagination
 * @route   GET /api/admin/bookings
 * @access  Private (Admin)
 */
export const getAllBookings = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    bookingType,
    dateFrom,
    dateTo,
  } = req.query;

  // Build filters
  const where = buildBookingFilters({
    search,
    status,
    bookingType,
    dateFrom,
    dateTo,
  });

  // Get pagination params
  const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));

  // Get bookings with filters and pagination
  const [bookings, totalCount] = await Promise.all([
    prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.booking.count({ where }),
  ]);

  // Transform bookings to include receipt URL
  const bookingsWithUrls = bookings.map((booking) => ({
    ...booking,
    paymentReceiptUrl: booking.paymentReceiptPath
      ? `/uploads/receipts/${booking.paymentReceiptPath}`
      : null,
  }));

  // Get pagination metadata
  const pagination = getPaginationMeta(totalCount, parseInt(page), parseInt(limit));

  res.status(200).json(
    successResponse(
      {
        bookings: bookingsWithUrls,
        pagination,
      },
      'Bookings retrieved successfully'
    )
  );
});

/**
 * @desc    Get single booking by ID
 * @route   GET /api/admin/bookings/:id
 * @access  Private (Admin)
 */
export const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await prisma.booking.findUnique({
    where: { id: parseInt(id) },
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Add receipt URL
  const bookingWithUrl = {
    ...booking,
    paymentReceiptUrl: booking.paymentReceiptPath
      ? `/uploads/receipts/${booking.paymentReceiptPath}`
      : null,
  };

  res.status(200).json(successResponse(bookingWithUrl, 'Booking retrieved successfully'));
});

/**
 * @desc    Update booking status
 * @route   PATCH /api/admin/bookings/:id
 * @access  Private (Admin)
 */
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { bookingStatus, paymentStatus, cancellationReason } = req.body;

  // Check if booking exists
  const existingBooking = await prisma.booking.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existingBooking) {
    throw new AppError('Booking not found', 404);
  }

  // Build update data
  const updateData = {};

  if (bookingStatus !== undefined) {
    updateData.bookingStatus = bookingStatus;
  }

  if (paymentStatus !== undefined) {
    updateData.paymentStatus = paymentStatus;
  }

  if (cancellationReason !== undefined) {
    updateData.cancellationReason = cancellationReason;
  }

  // Update booking
  const updatedBooking = await prisma.booking.update({
    where: { id: parseInt(id) },
    data: updateData,
  });

  res.status(200).json(
    successResponse(updatedBooking, 'Booking updated successfully')
  );
});

/**
 * @desc    Cancel/Delete booking
 * @route   DELETE /api/admin/bookings/:id
 * @access  Private (Admin)
 */
export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cancellationReason } = req.body;

  // Check if booking exists
  const booking = await prisma.booking.findUnique({
    where: { id: parseInt(id) },
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Update booking status to cancelled instead of deleting
  const cancelledBooking = await prisma.booking.update({
    where: { id: parseInt(id) },
    data: {
      bookingStatus: 'cancelled',
      cancellationReason: cancellationReason || 'Cancelled by admin',
    },
  });

  res.status(200).json(
    successResponse(cancelledBooking, 'Booking cancelled successfully')
  );
});

/**
 * @desc    Get current admin user info
 * @route   GET /api/admin/me
 * @access  Private (Admin)
 */
export const getCurrentAdmin = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  res.status(200).json(successResponse(user, 'User info retrieved successfully'));
});
