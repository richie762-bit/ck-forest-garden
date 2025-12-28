# Gallery Management Setup Guide

This guide explains how to set up the gallery management system that allows you to upload photos with captions through the admin panel.

## 1. Database Setup

### Run the SQL Migration

You need to create the `gallery_images` table and storage bucket in Supabase:

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Navigate to SQL Editor** (left sidebar)
3. **Create a new query**
4. **Copy and paste** the contents of `supabase-migrations/create_gallery_images.sql`
5. **Click "Run"**

This will:
- Create the `gallery_images` table
- Set up Row Level Security policies
- Create indexes for better performance
- Insert the existing 11 gallery images as default data

### Create Storage Bucket

1. **Go to Storage** in Supabase Dashboard (left sidebar)
2. **Click "Create a new bucket"**
3. **Bucket name**: `gallery-images`
4. **Public bucket**: ✅ Check this (images need to be publicly accessible)
5. **Click "Create bucket"**

### Set Storage Policies

After creating the bucket:
1. Click on the `gallery-images` bucket
2. Go to **Policies** tab
3. Create the following policies:

**Policy 1: Public Read Access**
- Policy name: `Public Access`
- Allowed operation: `SELECT`
- Target roles: `public`
- Policy definition: `true`

**Policy 2: Authenticated Upload**
- Policy name: `Authenticated Upload`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- Policy definition: `true`

## 2. Using the Gallery Manager

### Access the Admin Panel

1. Navigate to `/admin/login`
2. Login with your admin credentials
3. Click **Gallery** in the sidebar

### Upload New Photos

1. Click the file upload area or drag and drop an image
2. Fill in the required fields:
   - **Title**: Short title for the image (e.g., "Beautiful Sunset")
   - **Caption**: Descriptive text shown in the slideshow
   - **Category**: Choose from overview, nature, activities, facilities, events, timeline
   - **Display Order**: Number that determines order (lower numbers appear first)
3. Click **Upload Image**

### Manage Existing Photos

- **Edit**: Click the edit icon to modify title, caption, or category
- **Hide/Show**: Click the eye icon to toggle visibility on the website
- **Delete**: Click the trash icon to permanently remove the image

## 3. How It Works

### Frontend Display

- **Gallery Page**: Shows the first 3 active images in a preview grid
- **Slideshow**: Displays ALL active images in a full-screen slideshow
- Images are sorted by `display_order` (ascending)

### Database Structure

```sql
gallery_images:
- id (UUID)
- title (VARCHAR)
- caption (TEXT)
- image_url (TEXT)
- display_order (INTEGER)
- is_active (BOOLEAN)
- category (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### File Storage

- Images are uploaded to Supabase Storage bucket: `gallery-images`
- Files are stored as: `gallery/gallery-{timestamp}.{ext}`
- Public URLs are automatically generated

## 4. Default Images

The migration includes 11 default gallery images that reference the existing files in `/assets/images/gallery/`. These provide a starting point and will display even if the database isn't set up yet (fallback mechanism).

## 5. Troubleshooting

### Images Not Showing Up

1. **Check if table exists**: Run `SELECT * FROM gallery_images;` in Supabase SQL Editor
2. **Check storage bucket**: Verify `gallery-images` bucket exists and is public
3. **Check browser console**: Look for error messages
4. **Verify RLS policies**: Make sure policies allow public SELECT

### Upload Failing

1. **Check authentication**: Ensure you're logged in as admin
2. **Verify storage policies**: Authenticated users need INSERT permission
3. **Check file size**: Large files (>10MB) may fail
4. **Check file format**: Only image files (PNG, JPG, etc.) are accepted

### Database Connection Issues

- Verify your `.env` file has correct Supabase credentials:
  ```
  VITE_SUPABASE_URL=your_supabase_url
  VITE_SUPABASE_ANON_KEY=your_anon_key
  ```

## 6. Tips

- **Use descriptive captions**: They appear in the slideshow for context
- **Organize with categories**: Makes it easier to manage large collections
- **Set display order thoughtfully**: Put your best images first (lower numbers)
- **Hide instead of delete**: Toggle `is_active` to keep images but hide them temporarily
- **Optimize images**: Compress large images before uploading for better performance
