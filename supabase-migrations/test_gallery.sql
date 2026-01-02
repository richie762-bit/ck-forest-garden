-- Test query to check gallery_images table status

-- 1. Check if table exists and show structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'gallery_images'
ORDER BY ordinal_position;

-- 2. Show all current gallery images
SELECT id, title, caption, is_active, display_order, category, created_at
FROM gallery_images
ORDER BY display_order;

-- 3. Count active vs inactive images
SELECT
  is_active,
  COUNT(*) as count
FROM gallery_images
GROUP BY is_active;

-- 4. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'gallery_images';
