-- ========================================
-- CK Forest Gardens - Supabase Schema Setup
-- Run this in your Supabase SQL Editor
-- ========================================

-- Create bookings table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS bookings (
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

-- If table already exists, add any missing columns
DO $$
BEGIN
    -- Check and add add_ons column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='bookings' AND column_name='add_ons') THEN
        ALTER TABLE bookings ADD COLUMN add_ons JSONB DEFAULT '{}';
    END IF;

    -- Check and add deposit_amount column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='bookings' AND column_name='deposit_amount') THEN
        ALTER TABLE bookings ADD COLUMN deposit_amount INTEGER;
    END IF;

    -- Check and add receipt_url column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='bookings' AND column_name='receipt_url') THEN
        ALTER TABLE bookings ADD COLUMN receipt_url TEXT;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_booking_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_customer_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_booking_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_date_from ON bookings(date_from);
CREATE INDEX IF NOT EXISTS idx_created_at ON bookings(created_at);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public inserts" ON bookings;
DROP POLICY IF EXISTS "Allow read confirmed bookings" ON bookings;
DROP POLICY IF EXISTS "Allow authenticated read all" ON bookings;
DROP POLICY IF EXISTS "Allow authenticated updates" ON bookings;

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

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'Database schema setup complete!';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Go to Storage and create a bucket named "booking-receipts"';
    RAISE NOTICE '2. Make the bucket PUBLIC';
    RAISE NOTICE '3. Set up storage policies (see below)';
END $$;
