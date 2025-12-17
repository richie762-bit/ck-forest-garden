# ✅ Final Setup Checklist

Your Supabase is now configured! Follow these remaining steps.

---

## ✅ Step 1: Environment Variables - DONE!

Your `client/.env` is correctly configured:
- ✅ Project URL: `https://xkshddqapghffhiaqvtc.supabase.co`
- ✅ Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 📋 Step 2: Set Up Supabase Database

### 2.1 Run Package Schema SQL

1. **Go to SQL Editor:**
   https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc/sql/new

2. **Open your local file:** `supabase-packages-schema.sql`

3. **Copy EVERYTHING from the file**

4. **Paste into Supabase SQL Editor**

5. **Click "Run"** (or press Ctrl+Enter)

6. **Expected result:**
   ```
   Success. No rows returned
   ```

**This creates:**
- ✅ `packages` table
- ✅ 3 default sample packages
- ✅ Row Level Security policies
- ✅ Indexes and triggers

---

## 🖼️ Step 3: Create Storage Bucket

### 3.1 Create the Bucket

1. **Go to Storage:**
   https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc/storage/buckets

2. **Click "Create a new bucket"**

3. **Enter:**
   - Name: `package-images`
   - Public bucket: Toggle **ON** ✅

4. **Click "Create bucket"**

### 3.2 Set Storage Policies

1. **Go to SQL Editor:**
   https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc/sql/new

2. **Run this SQL:**

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

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update package images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'package-images');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete package images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'package-images');
```

3. **Click "Run"**

---

## 👤 Step 4: Create Admin User

1. **Go to Authentication → Users:**
   https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc/auth/users

2. **Click "Add user"** → **"Create new user"**

3. **Fill in:**
   - Email: `admin@ckforestgarden.com`
   - Password: [Choose a STRONG password]
   - **Auto Confirm User:** Toggle **ON** ✅

4. **Click "Create user"**

5. **IMPORTANT:** Write down your password securely!

---

## 🧪 Step 5: Test Locally

### 5.1 Start Your App

```bash
cd client
npm run dev
```

### 5.2 Test Login

1. **Go to:** http://localhost:5173/admin/login

2. **Login with:**
   - Email: `admin@ckforestgarden.com`
   - Password: [your password from Step 4]

3. **Expected:** Redirect to dashboard ✅

### 5.3 Test Package Management

1. **Click "Packages"** in the sidebar

2. **You should see:** 3 default packages

3. **Try creating a new package:**
   - Click "Create Package"
   - Fill in title, description, price
   - Add some highlights
   - Upload a test image
   - Click "Create Package"

4. **Expected:** Package created successfully ✅

### 5.4 Test Public View

1. **Go to:** http://localhost:5173/pricing

2. **Expected:** Your packages appear with images ✅

---

## 🚀 Step 6: Deploy to Production

### 6.1 Add Environment Variables to Vercel

1. **Go to Vercel Dashboard:**
   https://vercel.com/dashboard

2. **Select your project** → **Settings** → **Environment Variables**

3. **Add these TWO variables:**

   **Variable 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://xkshddqapghffhiaqvtc.supabase.co`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

   **Variable 2:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhrc2hkZHFhcGdoZmZoaWFxdnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NDA3MzEsImV4cCI6MjA4MTUxNjczMX0.n0zGBCL3GrzuqcLHHgH-bcbMxyCDCpZk0MBnl5yNdbw`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

### 6.2 Deploy

```bash
git add .
git commit -m "Configure Supabase and add package management"
git push origin main
```

**Vercel will automatically deploy!**

### 6.3 Test Production

1. **Wait for deployment to complete** (check Vercel dashboard)

2. **Test production login:**
   - Go to: `https://your-site.vercel.app/admin/login`
   - Login with your credentials

3. **Test package management on production**

4. **View public pricing page:**
   - Go to: `https://your-site.vercel.app/pricing`

---

## ✅ Final Verification Checklist

- [ ] Ran `supabase-packages-schema.sql` successfully
- [ ] Created `package-images` storage bucket (PUBLIC)
- [ ] Set storage policies
- [ ] Created admin user with strong password
- [ ] Can login locally
- [ ] Can create packages locally
- [ ] Can upload images locally
- [ ] Packages appear on local pricing page
- [ ] Added Vercel environment variables
- [ ] Deployed to Vercel
- [ ] Can login on production
- [ ] Can create packages on production
- [ ] Packages appear on production pricing page

---

## 🎉 You're Done!

Once all checkboxes are checked, you have:

- ✅ Supabase authentication (no server needed!)
- ✅ Dynamic package management
- ✅ Image uploads to Supabase Storage
- ✅ Flashcard-style image carousels
- ✅ Production deployment on Vercel

---

## 📝 Important Info to Save

**Supabase Project:** `xkshddqapghffhiaqvtc`

**Supabase Dashboard:**
https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc

**Admin Credentials:**
- Email: `admin@ckforestgarden.com`
- Password: [Write it down!]

**Vercel Project:**
- URL: `https://your-site.vercel.app`

---

## 🆘 Need Help?

If something doesn't work:

1. **Check browser console** for errors (F12)
2. **Check Supabase logs:** Dashboard → Logs
3. **Check Vercel logs:** Dashboard → Deployments → Latest → Logs
4. **Verify environment variables** are set correctly

---

## 🎯 Next Steps After Setup

1. **Delete default packages** (or customize them)
2. **Create your real packages**
3. **Upload high-quality images**
4. **Test booking flow**
5. **Share your live site!**

---

**Ready?** Start with Step 2 above! 🚀
