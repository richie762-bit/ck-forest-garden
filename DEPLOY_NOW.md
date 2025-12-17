# 🚀 Deploy to Production NOW - Quick Guide

Follow these steps to deploy your site with Supabase to production.

## ✅ Pre-Deployment Checklist

Before you start, make sure you have:
- [ ] Access to Supabase Dashboard: https://app.supabase.com
- [ ] Access to Vercel Dashboard: https://vercel.com
- [ ] Your Supabase project: `eizzbqsaqjxfywdwvhzy`
- [ ] Decided on a strong admin password

## 🎯 Deployment Steps (15 minutes)

### Step 1: Set Up Supabase Database (5 min)

1. **Go to Supabase:**
   - Visit: https://app.supabase.com/project/eizzbqsaqjxfywdwvhzy

2. **Run Database Schema:**
   - Click **SQL Editor** → **New Query**
   - Open your local file: `supabase-packages-schema.sql`
   - Copy ALL contents
   - Paste into Supabase SQL Editor
   - Click **Run** or press `Ctrl+Enter`
   - Should see: "Success. No rows returned"

3. **Create Storage Bucket:**
   - Click **Storage** → **Create a new bucket**
   - Name: `package-images`
   - **Public bucket:** Toggle ON ✅
   - Click **Create bucket**

4. **Set Storage Policies:**
   - Go to SQL Editor
   - Run this SQL:

```sql
CREATE POLICY "Public can view package images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'package-images');

CREATE POLICY "Authenticated users can upload package images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'package-images');

CREATE POLICY "Authenticated users can delete package images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'package-images');
```

5. **Create Admin User:**
   - Click **Authentication** → **Users** → **Add user**
   - Email: `admin@ckforestgarden.com`
   - Password: [Choose strong password - write it down!]
   - **Auto Confirm User:** Toggle ON ✅
   - Click **Create user**

### Step 2: Configure Vercel (5 min)

1. **Go to Vercel:**
   - Visit: https://vercel.com/dashboard
   - Select your CK Forest Garden project

2. **Add Environment Variables:**
   - Click **Settings** → **Environment Variables**

   Add these TWO variables (already in your local `.env`):

   **Variable 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://xkshddqapghffhiaqvtc.supabase.co`
   - Environments: Check **Production**, **Preview**, **Development**
   - Click **Save**

   **Variable 2:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpenpicXNhcWp4Znl3ZHd2aHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczODY5MTEsImV4cCI6MjA1Mjk2MjkxMX0.xQwL4vYJHxKJqN8YRq8ZQyF0xGqN6Z5rQqLqH4sVJKo`
   - Environments: Check **Production**, **Preview**, **Development**
   - Click **Save**

### Step 3: Deploy (5 min)

**Option A: Auto Deploy (GitHub Connected)**

```bash
# In your project directory
git add .
git commit -m "Add Supabase auth and package management"
git push origin main
```

Vercel will automatically deploy!

**Option B: Manual Deploy**

```bash
cd client
vercel --prod
```

Follow the prompts.

### Step 4: Test Production (5 min)

1. **Wait for deployment** (Vercel will show you the URL)

2. **Test Public Page:**
   - Go to: `https://your-site.vercel.app/pricing`
   - Should see 3 default packages

3. **Test Admin Login:**
   - Go to: `https://your-site.vercel.app/admin/login`
   - Login with your admin email and password
   - Should redirect to dashboard

4. **Test Package Management:**
   - In admin, click **Packages**
   - Try creating a test package
   - Upload an image
   - Go to pricing page and see it appear

5. **Clean Up:**
   - Delete or edit the 3 default packages
   - Create your real packages
   - Upload real images

## 🎉 You're Live!

Your site is now deployed with:
- ✅ Supabase authentication (no server needed!)
- ✅ Dynamic package management
- ✅ Image uploads to Supabase Storage
- ✅ Flashcard-style image carousels
- ✅ Full admin panel

## 📝 Write Down Your Credentials

**Production Admin Login:**
- URL: `https://_____________________.vercel.app/admin/login`
- Email: `admin@ckforestgarden.com`
- Password: `_____________________`

**Supabase Dashboard:**
- URL: `https://app.supabase.com/project/eizzbqsaqjxfywdwvhzy`

## 🐛 Quick Troubleshooting

**Build fails on Vercel?**
- Check Vercel logs in deployment
- Verify environment variables are set
- Make sure both variables are saved

**Can't login on production?**
- Check you created admin user in Supabase
- Verify "Auto Confirm User" was ON
- Try resetting password in Supabase

**Packages not showing?**
- Check SQL schema ran successfully
- Look at browser console for errors
- Verify Supabase URL/key in Vercel env vars

**Images not uploading?**
- Verify storage bucket is PUBLIC
- Check storage policies were created
- File size under 5MB

## 📚 Full Documentation

For more details, see:
- **Production Guide:** `PRODUCTION_DEPLOYMENT.md`
- **Quick Start:** `START_HERE.md`
- **Full System Docs:** `PACKAGE_SYSTEM_README.md`

## ✨ Next Steps

1. Create your real packages
2. Upload high-quality images
3. Test all features thoroughly
4. Share your live site!

---

**Your Production Site:** https://your-site.vercel.app

Congratulations! You're live! 🎊
