-- Fix RLS policies for gallery_images to allow updates
-- Run this if you're getting permission errors when trying to hide/show images

-- Drop and recreate all policies with correct permissions
DROP POLICY IF EXISTS "Allow public read access to active gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Allow authenticated users to insert gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Allow authenticated users to update gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Allow authenticated users to delete gallery images" ON gallery_images;

-- Policy 1: Public can read ONLY active images
CREATE POLICY "Allow public read access to active gallery images"
  ON gallery_images
  FOR SELECT
  USING (is_active = true);

-- Policy 2: Authenticated users can read ALL images (including hidden ones)
CREATE POLICY "Allow authenticated users to read all gallery images"
  ON gallery_images
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 3: Authenticated users can insert new images
CREATE POLICY "Allow authenticated users to insert gallery images"
  ON gallery_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy 4: Authenticated users can update ANY image field
CREATE POLICY "Allow authenticated users to update gallery images"
  ON gallery_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy 5: Authenticated users can delete images
CREATE POLICY "Allow authenticated users to delete gallery images"
  ON gallery_images
  FOR DELETE
  TO authenticated
  USING (true);

-- Verify policies were created
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'gallery_images'
ORDER BY policyname;

-- Test: Show current gallery images
SELECT id, title, is_active, display_order, category
FROM gallery_images
ORDER BY display_order;
