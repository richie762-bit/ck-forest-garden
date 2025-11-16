import axios from 'axios';

// Get API URL from environment variables with production fallback
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production'
  ? 'https://ck-forest-garden-api.onrender.com/api'
  : 'http://localhost:3000/api');

/**
 * Create axios instance with default config
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

/**
 * Request Interceptor
 * Adds JWT token to requests if available
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles errors globally
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to login if on admin route
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }

    // Extract error message
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    // Attach custom error message
    error.customMessage = errorMessage;

    return Promise.reject(error);
  }
);

// ===================================
// Public Booking APIs
// ===================================

/**
 * Create a new booking
 */
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

/**
 * Get booking by reference
 */
export const getBookingByReference = async (reference) => {
  const response = await api.get(`/bookings/${reference}`);
  return response.data;
};

/**
 * Upload payment receipt for a booking
 */
export const uploadPaymentReceipt = async (bookingId, file) => {
  const formData = new FormData();
  formData.append('receipt', file);

  const response = await api.post(`/bookings/${bookingId}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Get blocked dates (confirmed bookings)
 */
export const getBlockedDates = async () => {
  const response = await api.get('/bookings/blocked-dates');
  return response.data;
};

// ===================================
// Admin Authentication APIs
// ===================================

/**
 * Admin login
 */
export const adminLogin = async (email, password) => {
  const response = await api.post('/admin/login', { email, password });
  return response.data;
};

/**
 * Get current admin user info
 */
export const getCurrentAdmin = async () => {
  const response = await api.get('/admin/me');
  return response.data;
};

// ===================================
// Admin Dashboard APIs
// ===================================

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

/**
 * Get all bookings with filters
 */
export const getAllBookings = async (params = {}) => {
  // Remove empty string values from params
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
  );

  const response = await api.get('/admin/bookings', { params: cleanParams });
  return response.data;
};

/**
 * Get single booking by ID
 */
export const getBookingById = async (id) => {
  const response = await api.get(`/admin/bookings/${id}`);
  return response.data;
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (id, updates) => {
  const response = await api.patch(`/admin/bookings/${id}`, updates);
  return response.data;
};

/**
 * Cancel booking
 */
export const cancelBooking = async (id, cancellationReason) => {
  const response = await api.delete(`/admin/bookings/${id}`, {
    data: { cancellationReason },
  });
  return response.data;
};

export default api;
