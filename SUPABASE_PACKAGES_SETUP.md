# Supabase Packages Setup Guide

This guide will help you set up the packages management system with image storage in Supabase.

## Step 1: Run the SQL Schema

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase-packages-schema.sql`
5. Paste into the SQL editor
6. Click **Run** to execute the script

This will create:
- `packages` table with all necessary columns
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for automatic timestamp updates
- 3 default packages based on your current pricing

## Step 2: Create Storage Bucket for Package Images

### Option A: Using Supabase Dashboard (Recommended)

1. In your Supabase dashboard, navigate to **Storage** in the left sidebar
2. Click **Create a new bucket**
3. Configure the bucket:
   - **Name:** `package-images`
   - **Public bucket:** Toggle ON (images need to be publicly accessible)
   - **File size limit:** 5 MB
   - **Allowed MIME types:** Click "Restrict file upload" and add:
     - `image/jpeg`
     - `image/png`
     - `image/webp`
     - `image/gif`
4. Click **Create bucket**

### Option B: Using SQL (Alternative)

Run this in the SQL Editor:

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'package-images',
  'package-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);
```

## Step 3: Set Storage Policies

After creating the bucket, set up storage policies:

1. Go to **Storage** > **Policies**
2. Select the `package-images` bucket
3. Add the following policies:

### Policy 1: Public Read Access
- **Policy Name:** Public can view package images
- **Policy Definition:** SELECT
- **Target Roles:** public
- **Policy Expression:**
```sql
bucket_id = 'package-images'
```

### Policy 2: Authenticated Upload
- **Policy Name:** Authenticated users can upload package images
- **Policy Definition:** INSERT
- **Target Roles:** authenticated
- **Policy Expression:**
```sql
bucket_id = 'package-images'
```

### Policy 3: Authenticated Update
- **Policy Name:** Authenticated users can update package images
- **Policy Definition:** UPDATE
- **Target Roles:** authenticated
- **Policy Expression:**
```sql
bucket_id = 'package-images'
```

### Policy 4: Authenticated Delete
- **Policy Name:** Authenticated users can delete package images
- **Policy Definition:** DELETE
- **Target Roles:** authenticated
- **Policy Expression:**
```sql
bucket_id = 'package-images'
```

**Or use SQL to create all policies at once:**

```sql
-- Allow public to view images
CREATE POLICY "Public can view package images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'package-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload package images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'package-images');

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update package images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'package-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete package images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'package-images');
```

## Step 4: Verify Setup

Run these queries to verify everything is set up correctly:

```sql
-- Check if packages table exists and has data
SELECT * FROM packages ORDER BY display_order;

-- Check if storage bucket exists
SELECT * FROM storage.buckets WHERE name = 'package-images';

-- Check storage policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%package%';
```

## Step 5: Set Up Supabase Auth (For Admin)

Since we're removing Postgres/JWT authentication, you need to set up admin authentication in Supabase:

### Option 1: Use Supabase Auth (Recommended)

1. Go to **Authentication** > **Users** in Supabase dashboard
2. Click **Add user** > **Create new user**
3. Enter admin email: `admin@ckforestgarden.com`
4. Enter a secure password
5. Click **Create user**
6. Optionally: Auto-confirm the user if you want to skip email confirmation

### Option 2: Keep using your existing auth system

If you prefer to keep your current JWT auth system temporarily:
- Keep the admin authentication as-is
- Only use Supabase for package management
- The RLS policies check for `authenticated` role, so you'll need to either:
  - Sign in through Supabase auth, OR
  - Modify policies to allow operations based on custom claims

## Step 6: Environment Variables Check

Make sure your `client/.env` file has these variables:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://eizzbqsaqjxfywdwvhzy.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Next Steps

After completing this setup:
1. The packages table will be ready to store package data
2. The storage bucket will be ready to accept image uploads
3. The application code will handle creating, editing, and deleting packages
4. The pricing page will dynamically display packages from Supabase

## Testing the Setup

You can test the setup by running these queries:

```sql
-- Insert a test package
INSERT INTO packages (title, description, price, highlights)
VALUES (
  'Test Package',
  'This is a test package',
  1000.00,
  '["Test feature 1", "Test feature 2"]'::jsonb
);

-- Verify it was inserted
SELECT * FROM packages WHERE title = 'Test Package';

-- Delete the test package
DELETE FROM packages WHERE title = 'Test Package';
```

## Troubleshooting

### Can't see packages table
- Make sure you ran the SQL schema script
- Check for errors in the SQL Editor

### Can't upload images
- Verify the storage bucket is set to **public**
- Check storage policies are correctly set
- Ensure file size is under 5MB
- Verify MIME type is allowed

### Authentication issues
- Make sure you've created an admin user in Supabase Auth
- Verify the anon key is correctly set in environment variables
- Check RLS policies are enabled and correctly configured

## Migration Notes

This setup replaces:
- ❌ PostgreSQL Prisma database → ✅ Supabase PostgreSQL
- ❌ Server-side file storage → ✅ Supabase Storage
- ❌ Hardcoded pricing in React components → ✅ Dynamic packages from database
