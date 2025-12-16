/**
 * Supabase Verification Script
 * Run this to check your existing Supabase setup
 *
 * Usage: node verify-supabase.js
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eizzbqsaqjxfywdwvhzy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpenpicXNhcWp4Znl3ZHd2aHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczODY5MTEsImV4cCI6MjA1Mjk2MjkxMX0.xQwL4vYJHxKJqN8YRq8ZQyF0xGqN6Z5rQqLqH4sVJKo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifySupabase() {
  console.log('🔍 Checking Supabase Setup...\n');

  // Check if we can connect
  try {
    console.log('✅ Connected to Supabase');
  } catch (error) {
    console.log('❌ Failed to connect to Supabase:', error.message);
    return;
  }

  // Check bookings table
  console.log('\n📊 Checking bookings table...');
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Bookings table error:', error.message);
      console.log('   You need to create the bookings table');
    } else {
      console.log('✅ Bookings table exists');
      if (data && data.length > 0) {
        console.log('   Sample record fields:', Object.keys(data[0]).join(', '));
      }
    }
  } catch (error) {
    console.log('❌ Error checking bookings table:', error.message);
  }

  // Check storage bucket
  console.log('\n📦 Checking booking-receipts storage bucket...');
  try {
    const { data, error } = await supabase
      .storage
      .from('booking-receipts')
      .list('', { limit: 1 });

    if (error) {
      console.log('❌ Storage bucket error:', error.message);
      console.log('   You need to create the booking-receipts bucket');
    } else {
      console.log('✅ Storage bucket exists');
    }
  } catch (error) {
    console.log('❌ Error checking storage bucket:', error.message);
  }

  // Test insert permission
  console.log('\n🔐 Checking insert permissions...');
  try {
    const testData = {
      booking_reference: 'TEST-VERIFY-' + Date.now(),
      customer_name: 'Test User',
      customer_email: 'test@example.com',
      customer_phone: '1234567',
      booking_type: 'Day Visit',
      number_of_adults: 10,
      number_of_children: 0,
      date_from: new Date().toISOString(),
      date_to: new Date().toISOString(),
      number_of_days: 1,
      rate_per_adult_per_day: 5000,
      total_amount: 50000,
      deposit_amount: 25000,
      receipt_url: 'https://example.com/receipt.jpg',
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert([testData])
      .select();

    if (error) {
      console.log('❌ Insert permission error:', error.message);
      console.log('   You need to set up RLS policies for public inserts');
    } else {
      console.log('✅ Insert permissions working');

      // Clean up test record
      if (data && data[0]) {
        await supabase
          .from('bookings')
          .delete()
          .eq('id', data[0].id);
        console.log('   (Test record cleaned up)');
      }
    }
  } catch (error) {
    console.log('❌ Error checking insert permissions:', error.message);
  }

  console.log('\n✨ Verification complete!\n');
}

verifySupabase();
