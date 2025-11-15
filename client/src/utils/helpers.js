/**
 * Format currency to GYD
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  return `GYD ${amount.toLocaleString()}`;
};

/**
 * Format date to readable string
 * @param {string|Date} date
 * @returns {string}
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
 * Format date to short string
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date for input fields (YYYY-MM-DD)
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateForInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculate number of days between two dates
 * @param {string|Date} dateFrom
 * @param {string|Date} dateTo
 * @returns {number}
 */
export const calculateDays = (dateFrom, dateTo) => {
  const start = new Date(dateFrom);
  const end = new Date(dateTo);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Calculate total booking amount
 * Formula: numberOfAdults × 5000 × numberOfDays
 * @param {number} numberOfAdults
 * @param {number} numberOfDays
 * @returns {number}
 */
export const calculateTotalAmount = (numberOfAdults, numberOfDays) => {
  const ratePerAdultPerDay = 5000;
  return numberOfAdults * ratePerAdultPerDay * numberOfDays;
};

/**
 * Get status badge color
 * @param {string} status
 * @returns {string}
 */
export const getStatusColor = (status) => {
  const colors = {
    pending: 'badge-pending',
    confirmed: 'badge-confirmed',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get status display text
 * @param {string} status
 * @returns {string}
 */
export const getStatusText = (status) => {
  const texts = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return texts[status] || status;
};

/**
 * Validate file size and type
 * @param {File} file
 * @returns {object}
 */
export const validateFile = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, and PDF files are allowed' };
  }

  return { valid: true, error: null };
};

/**
 * Debounce function for search inputs
 * @param {Function} func
 * @param {number} delay
 * @returns {Function}
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Get greeting based on time of day
 * @returns {string}
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

/**
 * Truncate text to specified length
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Copy text to clipboard
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Download file from URL
 * @param {string} url
 * @param {string} filename
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Scroll to element smoothly
 * @param {string} elementId
 */
export const scrollToElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

/**
 * Check if date is in the past
 * @param {string|Date} date
 * @returns {boolean}
 */
export const isPastDate = (date) => {
  return new Date(date) < new Date();
};

/**
 * Get minimum date for booking (tomorrow)
 * @returns {string}
 */
export const getMinBookingDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDateForInput(tomorrow);
};

/**
 * Parse error message from API
 * @param {Error} error
 * @returns {string}
 */
export const parseErrorMessage = (error) => {
  return (
    error.customMessage ||
    error.response?.data?.message ||
    error.message ||
    'An unexpected error occurred'
  );
};

/**
 * Format phone number
 * @param {string} phone
 * @returns {string}
 */
export const formatPhoneNumber = (phone) => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Format as +592-XXX-XXXX for Guyana numbers
  if (cleaned.length === 10 && cleaned.startsWith('592')) {
    return `+${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get user from localStorage
 * @returns {object|null}
 */
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Save user to localStorage
 * @param {object} user
 * @param {string} token
 */
export const saveUser = (user, token) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
};

/**
 * Remove user from localStorage
 */
export const removeUser = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};
