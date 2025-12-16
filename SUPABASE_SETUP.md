# Supabase Setup Guide

This document outlines the required Supabase configuration for the CK Forest Gardens booking system.

## Database Table Schema

Create the following table in your Supabase project:

### Table: `bookings`

```sql
CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,
  booking_reference TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  booking_type TEXT NOT NULL,
  number_of_adults INTEGER NOT NULL CHECK (number_of_adults >= 10),
  number_of_children INTEGER DEFAULT 0,
  date_from TIMESTAMP WITH TIME ZONE NOT NULL,
  date_to TIMESTAMP WITH TIME ZONE NOT NULL,
  number_of_days INTEGER NOT NULL,
  rate_per_adult_per_day INTEGER DEFAULT 5000,
  total_amount INTEGER NOT NULL,
  deposit_amount INTEGER NOT NULL,
  add_ons JSONB DEFAULT '{}',
  receipt_url TEXT NOT NULL,
  booking_status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_booking_reference ON bookings(booking_reference);
CREATE INDEX idx_customer_email ON bookings(customer_email);
CREATE INDEX idx_booking_status ON bookings(booking_status);
CREATE INDEX idx_date_from ON bookings(date_from);
CREATE INDEX idx_created_at ON bookings(created_at);
```

### Column Descriptions

| Column                   | Type      | Description                                          |
|--------------------------|-----------|------------------------------------------------------|
| id                       | BIGSERIAL | Auto-incrementing primary key                        |
| booking_reference        | TEXT      | Unique booking reference (CK-YYYYMMDD-XXXXX)        |
| customer_name            | TEXT      | Full name of the customer                            |
| customer_email           | TEXT      | Customer email address                               |
| customer_phone           | TEXT      | Customer phone number (7 digits)                     |
| booking_type             | TEXT      | Type of booking (Day Visit, Weekend Camping, etc.)   |
| number_of_adults         | INTEGER   | Number of adults (minimum 10)                        |
| number_of_children       | INTEGER   | Number of children under 12 (FREE)                   |
| date_from                | TIMESTAMP | Start date of booking                                |
| date_to                  | TIMESTAMP | End date of booking                                  |
| number_of_days           | INTEGER   | Number of days (calculated)                          |
| rate_per_adult_per_day   | INTEGER   | Rate per adult per day (GYD 5,000)                   |
| total_amount             | INTEGER   | Total booking amount                                 |
| deposit_amount           | INTEGER   | Required deposit (50% of total)                      |
| add_ons                  | JSONB     | Selected add-ons (meals, transportation, tour guide) |
| receipt_url              | TEXT      | Public URL of uploaded payment receipt               |
| booking_status           | TEXT      | Status: pending, confirmed, completed, cancelled     |
| payment_status           | TEXT      | Payment status: pending, paid                        |
| created_at               | TIMESTAMP | Record creation timestamp                            |
| updated_at               | TIMESTAMP | Last update timestamp                                |

## Storage Bucket Setup

Create a storage bucket for receipt uploads:

### Bucket: `booking-receipts`

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `booking-receipts`
3. Make it **public** (receipts need to be viewable)
4. Set the following policies:

**Insert Policy (Allow authenticated and anonymous uploads):**
```sql
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'booking-receipts');
```

**Select Policy (Allow public reads):**
```sql
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
USING (bucket_id = 'booking-receipts');
```

## Row Level Security (RLS)

Enable RLS on the bookings table and add policies:

```sql
-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert bookings (for public booking form)
CREATE POLICY "Allow public inserts"
ON bookings FOR INSERT
WITH CHECK (true);

-- Policy: Allow anyone to read confirmed bookings (for date blocking)
CREATE POLICY "Allow read confirmed bookings"
ON bookings FOR SELECT
USING (booking_status = 'confirmed');

-- Policy: Allow authenticated users to read all bookings (for admin dashboard)
CREATE POLICY "Allow authenticated read all"
ON bookings FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to update bookings (for admin)
CREATE POLICY "Allow authenticated updates"
ON bookings FOR UPDATE
TO authenticated
USING (true);
```

## Environment Variables

Add the following to your `.env` and `.env.production` files:

```env
VITE_SUPABASE_URL=https://eizzbqsaqjxfywdwvhzy.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Testing the Setup

1. Ensure the `bookings` table exists with the correct schema
2. Verify the `booking-receipts` storage bucket is created and public
3. Test creating a booking from the frontend form
4. Verify the receipt uploads to storage
5. Check that the booking record is created in the database
6. Confirm that date locking works by selecting a confirmed booking's date range

## Date Locking Logic

The system fetches all confirmed bookings and blocks their date ranges on the calendar. When a user selects dates:
- The system checks if the selected range overlaps with any confirmed booking
- If there's an overlap, the form shows an error and prevents submission
- Only confirmed bookings block dates (pending bookings don't block dates)

## Add-ons Structure

The `add_ons` field is a JSONB object with the following structure:

```json
{
  "meals": true,
  "transportation": false,
  "tourGuide": true
}
```

## CK Forest Tours Link

All tours are conducted by CK Forest Tours: https://www.instagram.com/ckforesttours/

This link is displayed in the booking form's add-ons section.
