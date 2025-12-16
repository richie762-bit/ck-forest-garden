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

export default {
  createSupabaseBooking,
  getConfirmedBookings,
  uploadReceiptToStorage,
};
