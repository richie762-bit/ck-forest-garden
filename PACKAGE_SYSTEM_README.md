# Dynamic Package Management System

## Overview

Your CK Forest Garden website now has a fully dynamic package management system! You can create, edit, and delete packages from the admin panel, with flashcard-style image displays on the public pricing page.

## Quick Start

### 1. Set Up Supabase (One-time setup)

Run these SQL commands in your Supabase SQL Editor:

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Go to SQL Editor
3. Copy and paste the contents of `supabase-packages-schema.sql`
4. Click "Run"

### 2. Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **Create a new bucket**
3. Name: `package-images`
4. Toggle **Public bucket** to ON
5. Click **Create bucket**

Detailed instructions in: `SUPABASE_PACKAGES_SETUP.md`

### 3. Install Dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### 4. Start the Application

**Client:**
```bash
cd client
npm run dev
```

**Server (if needed for auth/email):**
```bash
cd server
npm run dev
```

## Using the Package Management System

### Admin Access

1. Navigate to: `http://localhost:5173/admin/login`
2. Log in with your admin credentials
3. Click **"Packages"** in the sidebar

### Creating a Package

1. Click **"Create Package"** button
2. Fill in the form:
   - **Title:** Package name (e.g., "Weekend Camping Experience")
   - **Description:** Detailed description of what's included
   - **Price:** Price in GYD (e.g., 5000.00)
   - **Price Unit:** Pricing model (default: "per person per day")
   - **Minimum Adults:** Required number of adults (default: 10)
   - **Children Free:** Toggle if children under 12 are free
   - **Booking Type:** Select from dropdown or leave blank
   - **Highlights:** Add features/benefits (click + to add each one)
   - **Images:** Drag and drop or click to upload (max 5 images, 5MB each)
   - **Display Order:** Lower numbers appear first (0 = first)
   - **Active:** Toggle to make visible to customers

3. Click **"Create Package"**

### Editing a Package

1. Find the package in the list
2. Click **"Edit"** button
3. Modify any fields
4. Add/remove images using the flashcard uploader
5. Reorder images with Left/Right arrows
6. Click **"Update Package"**

### Managing Package Images

**Upload Images:**
- Drag and drop files onto the upload area
- Or click to select from your computer
- Up to 5 images per package
- Max 5MB per image
- Supported formats: JPEG, PNG, WebP, GIF

**Reorder Images:**
- Use the "← Left" and "Right →" buttons
- First image shows first in the carousel

**Add Descriptions:**
- Type alt text for each image (optional but recommended)
- Helps with accessibility

**Remove Images:**
- Click the red X button on any image

### Hiding/Showing Packages

- Click **"Hide"** to deactivate (won't show on public page)
- Click **"Show"** to reactivate
- Hidden packages are still in the database

### Deleting Packages

- Click **"Delete"** button
- Confirm the deletion
- This permanently removes the package and all its images
- Cannot be undone!

## Public Pricing Page

Visit: `http://localhost:5173/pricing`

**Features:**
- Displays all active packages
- Flashcard image carousel with navigation
- Price, description, and highlights
- "Book This Package" button
- Responsive grid layout

**Image Carousel:**
- Click left/right arrows to navigate
- Click dots to jump to specific image
- Auto-hides navigation if only one image

## File Structure

```
client/src/
├── components/
│   ├── admin/
│   │   ├── PackagesList.jsx          # Package management list
│   │   ├── PackageForm.jsx           # Create/edit form
│   │   └── ImageUploader.jsx         # Flashcard image uploader
│   └── home/
│       └── Pricing.jsx                # Public pricing page (dynamic)
├── services/
│   └── packageService.js              # Supabase integration
└── pages/
    └── AdminDashboardPage.jsx         # Admin navigation

supabase-packages-schema.sql           # Database setup SQL
SUPABASE_PACKAGES_SETUP.md            # Detailed setup guide
MIGRATION_GUIDE.md                     # Migration from Postgres
```

## API Functions (packageService.js)

All functions are in `client/src/services/packageService.js`:

- `getPackages(includeInactive)` - Fetch all packages
- `getPackageById(id)` - Get single package
- `createPackage(data)` - Create new package
- `updatePackage(id, updates)` - Update package
- `deletePackage(id, hardDelete)` - Delete package
- `uploadPackageImage(file, packageId)` - Upload image to storage
- `deletePackageImage(url)` - Delete image from storage
- `addPackageImages(id, images)` - Add images to package
- `removePackageImage(id, url)` - Remove image from package
- `reorderPackages(ids)` - Change display order
- `togglePackageStatus(id)` - Activate/deactivate

## Environment Variables

**Client (`.env`):**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from: Supabase Dashboard → Settings → API

## Default Packages

The SQL script creates 3 default packages:
1. Day Visit Package - GYD 5,000
2. Weekend Camping Experience - GYD 5,000
3. Corporate Event Package - GYD 5,000

You can edit or delete these and create your own!

## Tips & Best Practices

### Images
- Use high-quality images (at least 1200x800px)
- Keep file sizes reasonable (under 2MB recommended)
- First image shows as the main image
- Add descriptive alt text for accessibility
- Use consistent aspect ratios for best appearance

### Pricing
- Be clear about what's included in the price
- Use the highlights section for key features
- Specify minimum requirements clearly
- Keep descriptions concise but informative

### Organization
- Use display_order to control the sequence
- Deactivate seasonal packages when not available
- Create separate packages for different experiences
- Use booking_type to categorize packages

### Performance
- Compress images before uploading
- Limit to 3-5 images per package
- Use WebP format for best compression
- Delete unused packages to keep database clean

## Common Tasks

### Change Package Order
1. Edit each package
2. Set display_order (0, 1, 2, etc.)
3. Lower numbers appear first

### Add Seasonal Package
1. Create new package
2. Set descriptive title (e.g., "Summer Special")
3. Upload seasonal images
4. When season ends, click "Hide"

### Update Pricing
1. Edit the package
2. Change the price field
3. Update description if needed
4. Click "Update Package"

### Bulk Image Update
1. Edit the package
2. Remove old images (click X)
3. Upload new images
4. Add descriptions
5. Click "Update Package"

## Troubleshooting

### Images not showing
- Check Supabase Storage bucket is PUBLIC
- Verify images were uploaded successfully
- Check browser console for errors
- Refresh the page

### Can't create packages
- Ensure you're logged in as admin
- Check Supabase connection
- Verify RLS policies are set up
- Check browser console

### Package not appearing on pricing page
- Make sure `is_active` is toggled ON
- Check that you saved the package
- Refresh the pricing page
- Verify package exists in database

### Upload fails
- Check file size (max 5MB)
- Verify file type (JPEG, PNG, WebP, GIF)
- Ensure storage bucket exists
- Check internet connection

## Advanced Features

### Custom Booking Types
Edit `PackageForm.jsx` to add more booking type options:
```jsx
<option value="custom_type">Custom Type Name</option>
```

### Price Calculations
Packages support:
- Fixed prices
- Per person pricing
- Per day pricing
- Custom price units

### Integration with Booking Form
The "Book This Package" button links to:
```
https://thestormkingg.github.io/ck-forest-gardens-booking-app/
```

You can modify this in `Pricing.jsx` line 197.

## Database Schema

**packages table columns:**
- `id` - UUID primary key
- `title` - Package name
- `description` - Full description
- `price` - Price in GYD (decimal)
- `price_unit` - Pricing model
- `min_adults` - Minimum adults required
- `children_free` - Kids free flag
- `booking_type` - Category
- `highlights` - JSONB array of features
- `images` - JSONB array of image objects
- `display_order` - Sort order
- `is_active` - Visibility flag
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Next Steps

1. ✅ Set up Supabase database and storage
2. ✅ Create your first package
3. ✅ Upload package images
4. ✅ Test the public pricing page
5. Consider adding:
   - More package varieties
   - Seasonal packages
   - Special event packages
   - Premium packages with extra features

## Support & Documentation

- **Setup Guide:** `SUPABASE_PACKAGES_SETUP.md`
- **Migration Guide:** `MIGRATION_GUIDE.md`
- **SQL Schema:** `supabase-packages-schema.sql`
- **Supabase Docs:** https://supabase.com/docs

---

**Congratulations!** You now have a fully dynamic, database-driven package management system with beautiful image carousels and an easy-to-use admin interface! 🎉
