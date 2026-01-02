# IMPORTANT: Database Setup Required

## Gallery Images Table Not Created Yet

The gallery hide/show functionality requires the `gallery_images` table to be created in your Supabase database.

### Quick Setup (5 minutes):

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Navigate to SQL Editor** (left sidebar)
3. **Click "New Query"**
4. **Copy and paste** the entire content from `supabase-migrations/create_gallery_images.sql`
5. **Click "Run"** (or press Ctrl+Enter)

### What This Creates:

- ✅ `gallery_images` table with all necessary fields
- ✅ Row Level Security policies (public can view, admins can edit)
- ✅ Indexes for better performance
- ✅ Default data (11 existing gallery images)

### After Running the Migration:

1. **Create Storage Bucket** (if not exists):
   - Go to Storage in Supabase Dashboard
   - Create bucket named: `gallery-images`
   - Make it **Public**
   - Add upload policy for authenticated users

2. **Test Gallery Admin**:
   - Go to `/admin/login`
   - Navigate to Gallery section
   - Try hiding/showing images
   - Upload a new test image

### Troubleshooting:

**If hide/show still doesn't work:**
- Check browser console for errors (F12)
- Verify table exists: Run `SELECT * FROM gallery_images;` in SQL Editor
- Check RLS policies are enabled
- Ensure you're logged in as admin

**If images don't appear:**
- Run the migration SQL (creates default images)
- Check that `is_active = true` in database
- Verify image URLs are correct

### Current Status:

❌ Database table NOT created (hide/show won't work)
✅ Code is ready and functional
✅ Migration file exists at: `supabase-migrations/create_gallery_images.sql`

**Action Required**: Run the SQL migration to enable full gallery functionality!
