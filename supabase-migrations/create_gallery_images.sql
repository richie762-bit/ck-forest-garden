-- Create gallery_images table for managing gallery photos
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  caption TEXT,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  category VARCHAR(50) DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_gallery_images_active ON gallery_images(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_images_order ON gallery_images(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);

-- Enable Row Level Security
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to active images
CREATE POLICY "Allow public read access to active gallery images"
  ON gallery_images
  FOR SELECT
  USING (is_active = true);

-- Policy: Allow authenticated users (admins) to insert images
CREATE POLICY "Allow authenticated users to insert gallery images"
  ON gallery_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users (admins) to update images
CREATE POLICY "Allow authenticated users to update gallery images"
  ON gallery_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users (admins) to delete images
CREATE POLICY "Allow authenticated users to delete gallery images"
  ON gallery_images
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default gallery images (existing ones from the site)
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
ON CONFLICT DO NOTHING;

COMMENT ON TABLE gallery_images IS 'Stores gallery images with captions for the website slideshow';
COMMENT ON COLUMN gallery_images.title IS 'Short title for the image';
COMMENT ON COLUMN gallery_images.caption IS 'Descriptive caption shown in slideshow';
COMMENT ON COLUMN gallery_images.image_url IS 'URL or path to the image';
COMMENT ON COLUMN gallery_images.display_order IS 'Order in which images appear (lower numbers first)';
COMMENT ON COLUMN gallery_images.is_active IS 'Whether the image is visible on the site';
COMMENT ON COLUMN gallery_images.category IS 'Category of the image (overview, nature, activities, facilities, events, timeline)';
