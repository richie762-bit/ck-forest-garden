# Quick Start Guide - Dynamic Packages

## 🚀 Get Started in 5 Minutes

### Step 1: Run SQL in Supabase (2 minutes)

1. Go to https://app.supabase.com → Your Project
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy ALL contents from `supabase-packages-schema.sql`
5. Paste and click **Run**
6. You should see "Success. No rows returned"

### Step 2: Create Storage Bucket (1 minute)

1. Click **Storage** (left sidebar)
2. Click **Create a new bucket**
3. Name: `package-images`
4. Toggle **Public bucket** to **ON**
5. Click **Create bucket**

### Step 3: Set Storage Policies (1 minute)

In SQL Editor, run this:

```sql
-- Allow public to view images
CREATE POLICY "Public can view package images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'package-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload package images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'package-images');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete package images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'package-images');
```

### Step 4: Install Dependencies (1 minute)

```bash
cd client
npm install
```

### Step 5: Start the App

```bash
npm run dev
```

## ✅ Verify It Works

1. Go to: http://localhost:5173/admin/login
2. Login with your admin credentials
3. Click **"Packages"** in sidebar
4. You should see 3 default packages!

## 📦 Create Your First Package

1. Click **"Create Package"**
2. Enter:
   - Title: "Test Package"
   - Description: "This is a test"
   - Price: 1000
   - Add at least one highlight
3. Upload an image (drag & drop)
4. Click **"Create Package"**
5. Visit http://localhost:5173/pricing to see it!

## 🎨 What You Get

- ✅ Fully dynamic pricing page
- ✅ Admin panel to manage packages
- ✅ Flashcard-style image carousel
- ✅ Create/Edit/Delete packages
- ✅ Upload up to 5 images per package
- ✅ Drag and drop image upload
- ✅ Reorder images
- ✅ Hide/show packages
- ✅ No more hardcoded pricing!

## 📁 Key Files Created

| File | Purpose |
|------|---------|
| `supabase-packages-schema.sql` | Database setup SQL |
| `SUPABASE_PACKAGES_SETUP.md` | Detailed setup instructions |
| `MIGRATION_GUIDE.md` | Full migration guide |
| `PACKAGE_SYSTEM_README.md` | Complete documentation |
| `client/src/services/packageService.js` | Supabase integration |
| `client/src/components/admin/PackagesList.jsx` | Package management |
| `client/src/components/admin/PackageForm.jsx` | Create/edit form |
| `client/src/components/admin/ImageUploader.jsx` | Image upload UI |
| `client/src/components/home/Pricing.jsx` | Public pricing (updated) |

## 🔧 Admin Access

**URL:** http://localhost:5173/admin/packages

**Features:**
- View all packages
- Create new packages
- Edit existing packages
- Upload/manage images
- Hide/show packages
- Delete packages
- Reorder display

## 🌐 Public View

**URL:** http://localhost:5173/pricing

**Features:**
- Dynamic package cards
- Image carousel with navigation
- Price display
- Highlights with checkmarks
- "Book This Package" buttons
- Responsive design

## 🎯 Next Steps

1. **Delete defaults:** Edit or delete the 3 default packages
2. **Add real packages:** Create packages for your actual offerings
3. **Upload images:** Add high-quality photos (max 5MB each)
4. **Test booking:** Click "Book This Package" to verify link
5. **Go live:** Deploy to production when ready

## 📚 Need More Help?

- **Full Documentation:** Read `PACKAGE_SYSTEM_README.md`
- **Setup Details:** Check `SUPABASE_PACKAGES_SETUP.md`
- **Migration Info:** See `MIGRATION_GUIDE.md`

## 🐛 Troubleshooting

**Can't see packages in admin?**
- Check you ran the SQL script
- Refresh the page
- Check browser console for errors

**Images not uploading?**
- Verify storage bucket is created
- Check bucket is set to PUBLIC
- Run the storage policies SQL

**Packages not showing on pricing page?**
- Make sure package `is_active` is ON
- Check the package was saved
- Verify Supabase connection

## 🎉 You're Done!

Your website now has a fully dynamic package management system. You can manage everything from the admin panel without touching code!

**Admin Panel:** `/admin/packages`
**Public View:** `/pricing`

Enjoy! 🌳
