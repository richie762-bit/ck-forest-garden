import { supabase } from '../config/supabase';

/**
 * Supabase Service
 * Handles direct database operations and file uploads to Supabase
 */

/**
 * Generate a unique booking reference
 * Format: CK-YYYYMMDD-XXXXX (random 5-digit number)
 */
const generateBookingReference = () => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `CK-${dateStr}-${randomNum}`;
};

/**
 * Upload receipt image to Supabase Storage
 * @param {File} file - The receipt image file
 * @param {string} bookingReference - Unique booking reference
 * @returns {Promise<string>} - Public URL of uploaded file
 */
export const uploadReceiptToStorage = async (file, bookingReference) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${bookingReference}-${Date.now()}.${fileExt}`;
    const filePath = `receipts/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('booking-receipts')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('booking-receipts')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Receipt upload error:', error);
    throw error;
  }
};

/**
 * Create a new booking in Supabase
 * @param {Object} bookingData - Booking form data
 * @param {File} receiptFile - Receipt image file
 * @returns {Promise<Object>} - Created booking data
 */
export const createSupabaseBooking = async (bookingData, receiptFile) => {
  try {
    // Generate unique booking reference
    const bookingReference = generateBookingReference();

    // Upload receipt to storage first
    const receiptUrl = await uploadReceiptToStorage(receiptFile, bookingReference);

    // Prepare booking data for Supabase
    const bookingRecord = {
      booking_reference: bookingReference,
      customer_name: bookingData.customerName,
      customer_email: bookingData.customerEmail,
      customer_phone: bookingData.customerPhone,
      booking_type: bookingData.bookingType,
      number_of_adults: bookingData.numberOfAdults,
      number_of_children: bookingData.numberOfChildren || 0,
      date_from: bookingData.dateFrom,
      date_to: bookingData.dateTo,
      number_of_days: bookingData.numberOfDays,
      rate_per_adult_per_day: 5000,
      total_amount: bookingData.totalAmount,
      deposit_amount: bookingData.depositAmount,
      add_ons: bookingData.addOns || {},
      receipt_url: receiptUrl,
      booking_status: 'pending', // Will be confirmed by admin after reviewing receipt
      payment_status: 'pending',
      created_at: new Date().toISOString(),
    };

    // Insert booking into Supabase
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingRecord])
      .select()
      .single();

    if (error) {
      throw new Error(`Booking creation failed: ${error.message}`);
    }

    return {
      status: 'success',
      data: {
        ...data,
        bookingReference: data.booking_reference,
      },
    };
  } catch (error) {
    console.error('Create booking error:', error);
    throw error;
  }
};

/**
 * Get all confirmed bookings to determine blocked dates
 * @returns {Promise<Array>} - Array of confirmed bookings with date ranges
 */
export const getConfirmedBookings = async () => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('date_from, date_to, booking_status')
      .eq('booking_status', 'confirmed')
      .order('date_from', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Get confirmed bookings error:', error);
    return [];
  }
};

/**
 * Upload gallery image to Supabase Storage
 * @param {File} file - The image file
 * @returns {Promise<string>} - Public URL of uploaded file
 */
export const uploadGalleryImageToStorage = async (file) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `gallery-${Date.now()}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('gallery-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('gallery-images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Gallery image upload error:', error);
    throw error;
  }
};

/**
 * Create a new gallery image record
 * @param {Object} imageData - Gallery image data (title, caption, imageUrl, category)
 * @returns {Promise<Object>} - Created image data
 */
export const createGalleryImage = async (imageData) => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .insert([{
        title: imageData.title,
        caption: imageData.caption,
        image_url: imageData.imageUrl,
        category: imageData.category || 'general',
        display_order: imageData.displayOrder || 0,
        is_active: true,
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create gallery image: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Create gallery image error:', error);
    throw error;
  }
};

/**
 * Get all active gallery images
 * @returns {Promise<Array>} - Array of gallery images
 */
export const getGalleryImages = async () => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch gallery images: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Get gallery images error:', error);
    return [];
  }
};

/**
 * Get all gallery images (including inactive ones) for admin
 * @returns {Promise<Array>} - Array of all gallery images
 */
export const getAllGalleryImagesAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch gallery images: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Get all gallery images error:', error);
    return [];
  }
};

/**
 * Update a gallery image
 * @param {string} id - Image ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} - Updated image data
 */
export const updateGalleryImage = async (id, updates) => {
  try {
    console.log('Updating gallery image:', { id, updates });

    // First, verify the user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user ? user.email : 'Not authenticated');

    if (!user) {
      throw new Error('You must be logged in to update gallery images');
    }

    const { data, error } = await supabase
      .from('gallery_images')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw new Error(`Database error: ${error.message} (Code: ${error.code})`);
    }

    if (!data) {
      throw new Error('No data returned from update - image may not exist');
    }

    console.log('Update successful:', data);
    return data;
  } catch (error) {
    console.error('Update gallery image error:', error);
    throw error;
  }
};

/**
 * Delete a gallery image
 * @param {string} id - Image ID
 * @returns {Promise<void>}
 */
export const deleteGalleryImage = async (id) => {
  try {
    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete gallery image: ${error.message}`);
    }
  } catch (error) {
    console.error('Delete gallery image error:', error);
    throw error;
  }
};

/**
 * ====================
 * LOGIN ATTEMPT TRACKING (Database-Based)
 * ====================
 */

/**
 * Get login attempt record for an email
 * @param {string} email - Email address
 * @returns {Promise<Object|null>} - Login attempt record or null
 */
export const getLoginAttempts = async (email) => {
  try {
    const { data, error } = await supabase
      .from('login_attempts')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      // If no record exists, that's okay - return null
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Get login attempts error:', error);
    return null;
  }
};

/**
 * Record a failed login attempt
 * @param {string} email - Email address
 * @returns {Promise<Object>} - Updated login attempt record with lockout info
 */
export const recordFailedLoginAttempt = async (email) => {
  try {
    // Get existing record
    const existing = await getLoginAttempts(email);

    if (existing) {
      // Check if currently locked
      if (existing.locked_until) {
        const lockoutTime = new Date(existing.locked_until);
        const now = new Date();

        if (now < lockoutTime) {
          // Still locked
          return {
            ...existing,
            isLocked: true,
            remainingMinutes: Math.ceil((lockoutTime - now) / 60000)
          };
        } else {
          // Lockout expired, reset attempts
          const { data, error } = await supabase
            .from('login_attempts')
            .update({
              attempt_count: 1,
              locked_until: null,
              last_attempt_at: new Date().toISOString()
            })
            .eq('email', email)
            .select()
            .single();

          if (error) throw error;

          return { ...data, isLocked: false };
        }
      }

      // Increment attempt count
      const newAttemptCount = existing.attempt_count + 1;
      let lockedUntil = null;

      // Lock after 3 attempts (15 minutes)
      if (newAttemptCount >= 3) {
        const lockoutDate = new Date();
        lockoutDate.setMinutes(lockoutDate.getMinutes() + 15);
        lockedUntil = lockoutDate.toISOString();
      }

      const { data, error } = await supabase
        .from('login_attempts')
        .update({
          attempt_count: newAttemptCount,
          locked_until: lockedUntil,
          last_attempt_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        isLocked: !!lockedUntil,
        remainingMinutes: lockedUntil ? 15 : 0
      };
    } else {
      // Create new record with first attempt
      const { data, error } = await supabase
        .from('login_attempts')
        .insert({
          email,
          attempt_count: 1,
          last_attempt_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return { ...data, isLocked: false };
    }
  } catch (error) {
    console.error('Record failed login attempt error:', error);
    throw error;
  }
};

/**
 * Check if an email is currently locked out
 * @param {string} email - Email address
 * @returns {Promise<Object>} - Lockout status { isLocked, remainingMinutes, attemptCount }
 */
export const checkLoginLockout = async (email) => {
  try {
    const record = await getLoginAttempts(email);

    if (!record) {
      return { isLocked: false, attemptCount: 0, remainingMinutes: 0 };
    }

    if (record.locked_until) {
      const lockoutTime = new Date(record.locked_until);
      const now = new Date();

      if (now < lockoutTime) {
        return {
          isLocked: true,
          attemptCount: record.attempt_count,
          remainingMinutes: Math.ceil((lockoutTime - now) / 60000),
          lockoutUntil: lockoutTime.getTime()
        };
      } else {
        // Lockout expired, auto-clear it
        await supabase
          .from('login_attempts')
          .update({
            attempt_count: 0,
            locked_until: null
          })
          .eq('email', email);

        return { isLocked: false, attemptCount: 0, remainingMinutes: 0 };
      }
    }

    return {
      isLocked: false,
      attemptCount: record.attempt_count,
      remainingMinutes: 0
    };
  } catch (error) {
    console.error('Check login lockout error:', error);
    return { isLocked: false, attemptCount: 0, remainingMinutes: 0 };
  }
};

/**
 * Clear login attempts for an email (on successful login)
 * @param {string} email - Email address
 * @returns {Promise<void>}
 */
export const clearLoginAttempts = async (email) => {
  try {
    const { error } = await supabase
      .from('login_attempts')
      .update({
        attempt_count: 0,
        locked_until: null
      })
      .eq('email', email);

    if (error && error.code !== 'PGRST116') {
      throw error;
    }
  } catch (error) {
    console.error('Clear login attempts error:', error);
    // Don't throw - this shouldn't block successful login
  }
};

/**
 * Admin function: Manually unlock an account
 * @param {string} email - Email address to unlock
 * @returns {Promise<void>}
 */
export const unlockAccount = async (email) => {
  try {
    const { error } = await supabase
      .from('login_attempts')
      .update({
        attempt_count: 0,
        locked_until: null
      })
      .eq('email', email);

    if (error && error.code !== 'PGRST116') {
      throw error;
    }
  } catch (error) {
    console.error('Unlock account error:', error);
    throw error;
  }
};

export default {
  createSupabaseBooking,
  getConfirmedBookings,
  uploadReceiptToStorage,
  uploadGalleryImageToStorage,
  createGalleryImage,
  getGalleryImages,
  getAllGalleryImagesAdmin,
  updateGalleryImage,
  deleteGalleryImage,
  // Login attempt tracking
  getLoginAttempts,
  recordFailedLoginAttempt,
  checkLoginLockout,
  clearLoginAttempts,
  unlockAccount,
};
