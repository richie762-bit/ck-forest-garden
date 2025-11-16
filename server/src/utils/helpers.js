/**
 * Generate unique booking reference
 * Format: CK-{timestamp}-{random}
 * Example: CK-1699123456789-a3b4c5
 */
export const generateBookingReference = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CK-${timestamp}-${random}`;
};

/**
 * Calculate number of days between two dates (inclusive)
 * @param {Date} dateFrom - Start date
 * @param {Date} dateTo - End date
 * @returns {number} Number of days (inclusive - same day = 1, next day = 2, etc.)
 */
export const calculateNumberOfDays = (dateFrom, dateTo) => {
  const start = new Date(dateFrom);
  const end = new Date(dateTo);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  // Add 1 to make it inclusive (16th to 16th = 1 day, 15th to 16th = 2 days)
  return diffDays + 1;
};

/**
 * Calculate total booking amount
 * Formula: numberOfAdults × ratePerAdultPerDay × numberOfDays
 * @param {number} numberOfAdults
 * @param {number} numberOfDays
 * @param {number} ratePerAdultPerDay - Default: 5000
 * @returns {number} Total amount
 */
export const calculateTotalAmount = (
  numberOfAdults,
  numberOfDays,
  ratePerAdultPerDay = 5000
) => {
  return numberOfAdults * ratePerAdultPerDay * numberOfDays;
};

/**
 * Format date to readable string
 * @param {Date} date
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format currency amount (Guyanese Dollars)
 * @param {number} amount
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount) => {
  return `GYD ${amount.toLocaleString()}`;
};

/**
 * Sanitize filename for safe storage
 * @param {string} filename
 * @returns {string} Sanitized filename
 */
export const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
};

/**
 * Pagination helper
 * @param {number} page - Current page (1-indexed)
 * @param {number} limit - Items per page
 * @returns {object} Prisma skip and take values
 */
export const getPaginationParams = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const take = limit;
  return { skip, take };
};

/**
 * Calculate pagination metadata
 * @param {number} totalItems - Total number of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} Pagination metadata
 */
export const getPaginationMeta = (totalItems, page = 1, limit = 10) => {
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage,
    hasPrevPage,
  };
};

/**
 * Build Prisma where clause for search/filter
 * @param {object} filters - Filter parameters
 * @returns {object} Prisma where clause
 */
export const buildBookingFilters = (filters = {}) => {
  const where = {};

  // Search by customer name, email, or booking reference
  if (filters.search) {
    where.OR = [
      { customerName: { contains: filters.search, mode: 'insensitive' } },
      { customerEmail: { contains: filters.search, mode: 'insensitive' } },
      { bookingReference: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  // Filter by booking status
  if (filters.status) {
    where.bookingStatus = filters.status;
  }

  // Filter by booking type
  if (filters.bookingType) {
    where.bookingType = filters.bookingType;
  }

  // Filter by date range
  if (filters.dateFrom || filters.dateTo) {
    where.dateFrom = {};
    if (filters.dateFrom) {
      where.dateFrom.gte = new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      where.dateFrom.lte = new Date(filters.dateTo);
    }
  }

  return where;
};

/**
 * Validate booking dates
 * @param {Date} dateFrom
 * @param {Date} dateTo
 * @returns {object} Validation result
 */
export const validateBookingDates = (dateFrom, dateTo) => {
  const now = new Date();
  const start = new Date(dateFrom);
  const end = new Date(dateTo);

  const errors = [];

  // Check if dates are valid
  if (isNaN(start.getTime())) {
    errors.push('Invalid start date');
  }
  if (isNaN(end.getTime())) {
    errors.push('Invalid end date');
  }

  // Check if start date is in the past
  if (start < now) {
    errors.push('Start date cannot be in the past');
  }

  // Check if end date is before start date (same-day bookings are allowed)
  if (end < start) {
    errors.push('End date cannot be before start date');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Generate success response
 * @param {object} data
 * @param {string} message
 * @returns {object} Response object
 */
export const successResponse = (data, message = 'Success') => {
  return {
    status: 'success',
    message,
    data,
  };
};

/**
 * Generate error response
 * @param {string} message
 * @param {number} statusCode
 * @returns {object} Response object
 */
export const errorResponse = (message, statusCode = 500) => {
  return {
    status: 'error',
    message,
    statusCode,
  };
};
