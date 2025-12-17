-- =============================================
-- CK Forest Garden - Packages Table Schema
-- =============================================
-- This script creates the packages table for managing
-- dynamic pricing packages with image support

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  price_unit VARCHAR(50) DEFAULT 'per person per day',
  min_adults INTEGER DEFAULT 10,
  children_free BOOLEAN DEFAULT true,
  booking_type VARCHAR(50),
  highlights JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on display_order for sorting
CREATE INDEX IF NOT EXISTS idx_packages_display_order ON packages(display_order);

-- Create index on is_active for filtering
CREATE INDEX IF NOT EXISTS idx_packages_is_active ON packages(is_active);

-- Create index on booking_type for filtering
CREATE INDEX IF NOT EXISTS idx_packages_booking_type ON packages(booking_type);

-- Enable Row Level Security
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active packages
CREATE POLICY "Public can view active packages"
  ON packages
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can view all packages (for admin)
CREATE POLICY "Authenticated users can view all packages"
  ON packages
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert packages (for admin)
CREATE POLICY "Authenticated users can insert packages"
  ON packages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update packages (for admin)
CREATE POLICY "Authenticated users can update packages"
  ON packages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete packages (for admin)
CREATE POLICY "Authenticated users can delete packages"
  ON packages
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_packages_updated_at ON packages;
CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default packages (based on current pricing)
INSERT INTO packages (title, description, price, price_unit, min_adults, children_free, booking_type, highlights, display_order, is_active)
VALUES
(
  'Day Visit Package',
  'Perfect for a day of adventure and exploration in our beautiful forest garden. Enjoy nature trails, picnic areas, and guided tours.',
  5000.00,
  'per person per day',
  10,
  true,
  'day_visit',
  '["Access to all nature trails", "Picnic area usage", "Guided tour included", "Children under 12 FREE", "Minimum 10 adults required"]'::jsonb,
  1,
  true
),
(
  'Weekend Camping Experience',
  'Immerse yourself in nature with our 2-3 day camping experience. Includes camping site, facilities access, and organized activities.',
  5000.00,
  'per person per day',
  10,
  true,
  'weekend_camping',
  '["2-3 day camping access", "Camping facilities provided", "Bonfire area", "Night sky viewing", "Organized group activities", "Children under 12 FREE", "Minimum 10 adults required"]'::jsonb,
  2,
  true
),
(
  'Corporate Event Package',
  'Host your corporate retreat or team building event in our serene forest setting. Customizable packages available.',
  5000.00,
  'per person per day',
  10,
  true,
  'corporate_event',
  '["Exclusive event space", "Team building activities", "Catering options available", "Audio/visual equipment", "Professional event coordination", "Customizable schedule", "Minimum 10 adults required"]'::jsonb,
  3,
  true
);

-- Create storage bucket for package images (run this in Supabase Dashboard Storage section)
-- Bucket name: package-images
-- Public: true
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

COMMENT ON TABLE packages IS 'Stores pricing packages with images and details for CK Forest Garden';
COMMENT ON COLUMN packages.images IS 'Array of image objects with format: [{"url": "storage-url", "alt": "description", "order": 1}]';
COMMENT ON COLUMN packages.highlights IS 'Array of package highlights/features as strings';
