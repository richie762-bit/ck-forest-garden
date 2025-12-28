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
    const { data, error } = await supabase
      .from('gallery_images')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update gallery image: ${error.message}`);
    }

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
};
