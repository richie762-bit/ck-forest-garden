# Setup Your Supabase Project - Step by Step

Your Supabase Project: **xkshddqapghffhiaqvtc**

Dashboard: https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc

---

## 🔑 STEP 1: Get Your API Keys (2 minutes)

1. **Go to Settings → API:**
   https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc/settings/api

2. **Copy these values:**

   Under **Project URL:**
   - Copy: `https://xkshddqapghffhiaqvtc.supabase.co`

   Under **Project API keys** → **anon public:**
   - Copy the long key starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **Update your local `.env` file:**

   Open: `client/.env`

   Replace line 6 with your actual anon key:
   ```
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.paste-your-key-here
   ```

---

## 📊 STEP 2: Create Database Tables (3 minutes)

1. **Go to SQL Editor:**
   https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc/sql/new

2. **Copy the ENTIRE contents** of this file:
   `supabase-packages-schema.sql`

3. **Paste into the SQL Editor**

4. **Click "Run"** (or press Ctrl+Enter)

5. **You should see:**
   ```
   Success. No rows returned
   ```

**What this creates:**
- ✅ `packages` table to store your packages
- ✅ Row Level Security policies
- ✅ 3 default sample packages
- ✅ Indexes for fast queries
- ✅ Auto-update triggers

---

## 🖼️ STEP 3: Create Storage Bucket (2 minutes)

### Create the Bucket

1. **Go to Storage:**
   https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc/storage/buckets

2. **Click "Create a new bucket"** (green button)

3. **Fill in:**
   - **Name:** `package-images`
   - **Public bucket:** Toggle **ON** ✅
   - **File size limit:** `5242880` (5MB)
   - **Allowed MIME types:** Click "Restrict file upload"
     - Add: `image/jpeg`
     - Add: `image/png`
     - Add: `image/webp`
     - Add: `image/gif`

4. **Click "Create bucket"**

### Set Storage Policies

1. **Go back to SQL Editor:**
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

## 👤 STEP 4: Create Admin User (2 minutes)

1. **Go to Authentication → Users:**
   https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc/auth/users

2. **Click "Add user"** (green button, top right)

3. **Select "Create new user"**

4. **Fill in:**
   - **Email:** `admin@ckforestgarden.com`
   - **Password:** Choose a STRONG password
   - **Auto Confirm User:** Toggle **ON** ✅

5. **Click "Create user"**

6. **WRITE DOWN YOUR PASSWORD!** You'll need it to login.

---

## ✅ STEP 5: Verify Setup (2 minutes)

### Test Database

Go to SQL Editor and run:

```sql
-- Should return 3 (the default packages)
SELECT COUNT(*) FROM packages;

-- Should show your 3 default packages
SELECT id, title, price FROM packages;
```

### Test Storage

1. Go to Storage:
   https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc/storage/buckets/package-images

2. You should see the empty `package-images` bucket

### Test Admin User

1. Go to Authentication → Users:
   https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc/auth/users

2. You should see your admin user with:
   - Email: `admin@ckforestgarden.com`
   - Confirmed: ✅

---

## 🚀 STEP 6: Test Locally (5 minutes)

1. **Make sure your `.env` file has the correct anon key** (from Step 1)

2. **Start your client:**
   ```bash
   cd client
   npm run dev
   ```

3. **Test Login:**
   - Go to: http://localhost:5173/admin/login
   - Email: `admin@ckforestgarden.com`
   - Password: [your password from Step 4]
   - Should redirect to dashboard ✅

4. **Test Packages:**
   - Click "Packages" in sidebar
   - You should see 3 default packages
   - Try creating a new package
   - Upload an image
   - Save it

5. **Test Public View:**
   - Go to: http://localhost:5173/pricing
   - Your packages should appear!
   - Image carousel should work

---

## 🌐 STEP 7: Deploy to Production

### Update Vercel Environment Variables

1. **Go to Vercel:**
   https://vercel.com/dashboard

2. **Select your project** → **Settings** → **Environment Variables**

3. **Add/Update these variables:**

   **Variable 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://xkshddqapghffhiaqvtc.supabase.co`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

   **Variable 2:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: [Your anon key from Step 1]
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

### Deploy

```bash
git add .
git commit -m "Update to correct Supabase project"
git push origin main
```

Vercel will auto-deploy!

---

## ✅ Deployment Checklist

- [ ] Got API keys from Supabase
- [ ] Updated `client/.env` with correct anon key
- [ ] Ran `supabase-packages-schema.sql` in SQL Editor
- [ ] Created `package-images` storage bucket (PUBLIC)
- [ ] Set storage policies
- [ ] Created admin user with strong password
- [ ] Tested login locally
- [ ] Created a test package locally
- [ ] Updated Vercel environment variables
- [ ] Deployed to Vercel
- [ ] Tested login on production
- [ ] Tested package creation on production

---

## 🆘 Troubleshooting

### Can't login locally?
- Check you updated the anon key in `.env`
- Verify admin user exists in Supabase Auth
- Make sure "Auto Confirm User" was ON
- Try restarting your dev server

### Packages not showing?
- Check SQL schema ran successfully
- Look at browser console for errors
- Verify RLS policies are active

### Images not uploading?
- Check storage bucket is PUBLIC
- Verify storage policies were created
- File size must be under 5MB

### Build fails on Vercel?
- Check environment variables are set
- Verify both URL and anon key are correct
- Look at Vercel deployment logs

---

## 📝 Your Project Info

**Supabase Project ID:** `xkshddqapghffhiaqvtc`

**Important URLs:**
- Dashboard: https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc
- SQL Editor: https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc/sql
- Storage: https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc/storage/buckets
- Auth Users: https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc/auth/users
- Settings/API: https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc/settings/api

**Admin Credentials:**
- Email: `admin@ckforestgarden.com`
- Password: [Write it down securely!]

---

## 🎉 Next Steps

Once everything is set up:

1. Delete or edit the 3 default packages
2. Create your real packages
3. Upload high-quality images
4. Test thoroughly
5. Go live!

**Need help?** Check the browser console and Supabase logs for errors.

---

You're all set! Start with Step 1 above. 🚀
