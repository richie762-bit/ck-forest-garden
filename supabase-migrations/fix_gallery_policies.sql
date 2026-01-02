-- Fix for existing gallery_images table
-- This script safely updates the table without errors if it already exists

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to active gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Allow authenticated users to insert gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Allow authenticated users to update gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Allow authenticated users to delete gallery images" ON gallery_images;

-- Recreate policies
CREATE POLICY "Allow public read access to active gallery images"
  ON gallery_images
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow authenticated users to insert gallery images"
  ON gallery_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update gallery images"
  ON gallery_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete gallery images"
  ON gallery_images
  FOR DELETE
  TO authenticated
  USING (true);

-- Verify the table has the correct structure
DO $$
BEGIN
  -- Check if table exists and has correct columns
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gallery_images') THEN
    RAISE NOTICE 'Table gallery_images exists and policies have been updated';
  ELSE
    RAISE EXCEPTION 'Table gallery_images does not exist. Please run create_gallery_images.sql first';
  END IF;
END $$;

-- Insert default images if they don't exist
INSERT INTO gallery_images (title, caption, image_url, display_order, category) VALUES
  ('Aerial View', 'Aerial View of CK Forest Gardens', '/assets/images/gallery/Overhead.jpg', 1, 'overview'),
  ('Nature''s Heart', 'Nature''s Heart', '/assets/images/gallery/Heart.jpg', 2, 'nature'),
  ('Cozy Campfire', 'Cozy Campfire Evenings', '/assets/images/gallery/campfire.jpg', 3, 'activities'),
  ('Photography Paradise', 'Photography Paradise', '/assets/images/gallery/photography.jpg', 4, 'activities'),
  ('Picnic Areas', 'Picnic Areas', '/assets/images/gallery/PicnicArea.jpg', 5, 'facilities'),
  ('Stream Activities', 'Stream Activities', '/assets/images/gallery/StreamActivities.jpg', 6, 'activities'),
  ('Group Events', 'Group Events', '/assets/images/gallery/groupEvents.jpg', 7, 'events'),
  ('Hiking Trails', 'Hiking Trails', '/assets/images/gallery/Hiking.jpg', 8, 'activities'),
  ('Peaceful Relaxation', 'Peaceful Relaxation', '/assets/images/gallery/Relaxation.jpg', 9, 'nature'),
  ('Nature''s Paradise', 'Nature''s Paradise', '/assets/images/gallery/Advert.jpg', 10, 'overview'),
  ('Welcome Sign', 'Welcome to CK Forest Gardens', '/assets/images/gallery/Sign.jpg', 11, 'overview')
ON CONFLICT (id) DO NOTHING;

-- Show current gallery images
SELECT id, title, is_active, display_order, category FROM gallery_images ORDER BY display_order;
