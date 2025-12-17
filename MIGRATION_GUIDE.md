# Migration Guide: Postgres to Supabase Packages System

This guide explains the migration from Postgres/Prisma to Supabase for the dynamic packages system.

## What Changed

### Removed:
- ❌ PostgreSQL/Prisma database for bookings (if you were using it)
- ❌ Hardcoded pricing in React components
- ❌ Static package information
- ❌ Prisma dependencies from server

### Added:
- ✅ Supabase packages table with full CRUD support
- ✅ Supabase Storage for package images
- ✅ Dynamic package management in admin panel
- ✅ Flashcard-style image carousel for packages
- ✅ Admin interface to create, edit, and delete packages
- ✅ Public-facing dynamic pricing page

## Migration Steps

### Step 1: Set Up Supabase Database

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor**
3. Run the SQL script from `supabase-packages-schema.sql`

This will create:
- `packages` table with all necessary columns
- Row Level Security (RLS) policies
- Default packages based on your current pricing
- Indexes for performance

### Step 2: Create Supabase Storage Bucket

Follow the instructions in `SUPABASE_PACKAGES_SETUP.md` to:
1. Create the `package-images` storage bucket
2. Set it to PUBLIC
3. Configure storage policies for authenticated users

### Step 3: Clean Up Server Dependencies

Run the following commands in the `server` directory:

```bash
# Remove Prisma packages
npm uninstall @prisma/client prisma

# Remove Prisma-generated files
rm -rf prisma/
rm -rf node_modules/.prisma/

# Reinstall dependencies
npm install
```

### Step 4: Remove Old Files (Optional)

You can safely delete these files as they're no longer needed:

**Server Files:**
- `server/prisma/` - entire directory
- `server/src/config/database.js` - Prisma client singleton
- `server/src/controllers/adminController.js` - if only used for Prisma bookings
- `server/src/controllers/bookingController.js` - if only used for Prisma bookings
- `server/src/routes/adminRoutes.js` - if only used for Prisma
- `server/src/routes/bookingRoutes.js` - if only used for Prisma

**Keep these files if you still need server functionality:**
- Authentication routes (if using server-side JWT auth)
- Email sending functionality
- Any other business logic

### Step 5: Update Environment Variables

**Client `.env` (should already have these):**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Server `.env` (remove DATABASE_URL if not needed):**
```env
# Remove this if not using Postgres anymore
# DATABASE_URL=postgresql://...

# Keep these if still using server
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
```

### Step 6: Test the New System

1. **Start the client:**
   ```bash
   cd client
   npm run dev
   ```

2. **Navigate to admin panel:**
   - Go to http://localhost:5173/admin/login
   - Log in with your admin credentials
   - Click "Packages" in the sidebar

3. **Create a test package:**
   - Click "Create Package"
   - Fill in the form
   - Upload 1-5 images
   - Click "Create Package"

4. **View on public page:**
   - Go to http://localhost:5173/pricing
   - You should see your package with the flashcard image carousel

5. **Test editing:**
   - Go back to admin packages
   - Click "Edit" on a package
   - Modify details, add/remove images
   - Click "Update Package"

6. **Test deletion:**
   - Click "Hide" to soft-delete (package becomes inactive)
   - Click "Delete" to permanently remove

### Step 7: Deploy

1. **Run Supabase SQL in production:**
   - Go to your production Supabase project
   - Run the same SQL script from `supabase-packages-schema.sql`

2. **Create storage bucket in production:**
   - Follow the same storage setup steps for production

3. **Update production environment variables:**
   - Make sure client has production Supabase URL and anon key

4. **Deploy client:**
   ```bash
   cd client
   npm run build
   # Deploy to Vercel or your hosting provider
   ```

5. **Deploy server (if still needed):**
   ```bash
   cd server
   # Deploy to Render or your hosting provider
   ```

## New Admin Features

### Package Management (/admin/packages)

**Create Package:**
- Title, description, price
- Price unit (default: "per person per day")
- Minimum adults required
- Children free option
- Booking type selection
- Highlights/features list
- Up to 5 images with descriptions
- Display order
- Active/inactive status

**Edit Package:**
- Modify all package details
- Add/remove images
- Reorder images with left/right buttons
- Update highlights

**Delete Package:**
- Soft delete (hide): Sets `is_active` to false
- Hard delete: Permanently removes package and all images

**Image Management:**
- Drag and drop upload
- Multiple file selection
- Preview before upload
- Reorder with arrow buttons
- Alt text for accessibility
- Automatic storage in Supabase

### Public Pricing Page

**Features:**
- Displays all active packages
- Flashcard-style image carousel
- Previous/Next navigation buttons
- Dot indicators for multiple images
- Price display with GYD formatting
- Highlights with checkmarks
- "Book This Package" button linking to your booking form

## Database Schema

### packages table

```sql
id              UUID PRIMARY KEY
title           VARCHAR(255) NOT NULL
description     TEXT NOT NULL
price           DECIMAL(10, 2) NOT NULL
price_unit      VARCHAR(50) DEFAULT 'per person per day'
min_adults      INTEGER DEFAULT 10
children_free   BOOLEAN DEFAULT true
booking_type    VARCHAR(50)
highlights      JSONB (array of strings)
images          JSONB (array of {url, alt, order} objects)
display_order   INTEGER DEFAULT 0
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

### Storage: package-images bucket

- Public read access
- Authenticated write access
- Max file size: 5MB
- Allowed types: JPEG, PNG, WebP, GIF

## Troubleshooting

### Package images not showing
- Check that storage bucket is PUBLIC
- Verify storage policies are set correctly
- Check browser console for CORS errors
- Ensure image URLs are valid

### Can't create packages
- Verify you're logged in as admin
- Check RLS policies allow authenticated INSERT
- Check browser console for errors
- Verify Supabase anon key is correct

### Images not uploading
- Check file size (max 5MB)
- Verify file type (JPEG, PNG, WebP, GIF only)
- Check storage bucket exists
- Verify storage policies allow authenticated upload

### Packages not displaying on pricing page
- Check `is_active` is set to true
- Verify RLS policies allow public SELECT
- Check browser console for errors
- Verify `getPackages()` function is working

## Rollback Plan

If you need to rollback:

1. Keep the old Prisma code in git history
2. Revert package.json changes
3. Reinstall Prisma: `npm install @prisma/client prisma`
4. Run migrations: `npx prisma migrate dev`
5. Restore old Pricing.jsx component

## Support

For issues:
1. Check browser console for errors
2. Check Supabase logs in dashboard
3. Verify all environment variables are set
4. Ensure SQL script ran successfully
5. Check storage bucket configuration

## Next Steps

After successful migration:
- Add more packages for different seasons
- Upload high-quality images for each package
- Consider adding package categories
- Add package availability dates
- Implement package booking integration
- Add package reviews/testimonials
