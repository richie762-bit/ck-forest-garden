# Production Deployment Guide - Supabase & Vercel

This guide will help you deploy your CK Forest Garden website to production with Supabase.

## Overview

Your website is currently using:
- **Supabase Project:** `eizzbqsaqjxfywdwvhzy`
- **Supabase URL:** `https://eizzbqsaqjxfywdwvhzy.supabase.co`

This is ALREADY your production Supabase instance! We just need to set it up properly.

## Step-by-Step Production Setup

### Step 1: Set Up Production Supabase Database

Since you're using the same Supabase project for production, you need to run the setup once:

#### 1.1 Run Package Schema

1. Go to https://app.supabase.com/project/eizzbqsaqjxfywdwvhzy
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the ENTIRE contents of `supabase-packages-schema.sql`
5. Paste into the editor
6. Click **Run** (or press Ctrl+Enter)

You should see: "Success. No rows returned"

This creates:
- ✅ `packages` table
- ✅ Row Level Security policies
- ✅ 3 default packages
- ✅ Indexes for performance
- ✅ Auto-update triggers

#### 1.2 Create Storage Bucket

1. In Supabase Dashboard, click **Storage**
2. Click **Create a new bucket**
3. Enter:
   - **Name:** `package-images`
   - **Public bucket:** Toggle **ON** ✅
   - **File size limit:** 5 MB (5242880 bytes)
   - **Allowed MIME types:** (click "Restrict file upload")
     - Add: `image/jpeg`
     - Add: `image/png`
     - Add: `image/webp`
     - Add: `image/gif`
4. Click **Create bucket**

#### 1.3 Set Storage Policies

1. Stay in **Storage** section
2. Click on **Policies** tab
3. Select `package-images` bucket
4. Click **New Policy**

Or run this SQL in SQL Editor:

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

### Step 2: Create Production Admin User

1. In Supabase Dashboard, click **Authentication**
2. Click **Users** tab
3. Click **Add user** (green button, top right)
4. Select **Create new user**
5. Fill in:
   - **Email:** `admin@ckforestgarden.com` (or your preferred admin email)
   - **Password:** Choose a STRONG password for production
   - **Auto Confirm User:** Toggle **ON** ✅
6. Click **Create user**

**IMPORTANT:**
- Write down this password securely!
- Use a password manager
- This is your production admin password!

### Step 3: Verify Supabase Setup

Run these verification queries in SQL Editor:

```sql
-- Check packages table exists
SELECT COUNT(*) FROM packages;
-- Should return: 3 (the default packages)

-- Check storage bucket exists
SELECT * FROM storage.buckets WHERE name = 'package-images';
-- Should return: 1 row

-- Check admin user exists
SELECT email FROM auth.users WHERE email = 'admin@ckforestgarden.com';
-- Should return: your email

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'packages';
-- Should return: 5 policies
```

### Step 4: Configure Vercel Environment Variables

#### 4.1 Get Your Supabase Credentials

You already have them! They're in your `client/.env`:

```
VITE_SUPABASE_URL=https://eizzbqsaqjxfywdwvhzy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpenpicXNhcWp4Znl3ZHd2aHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczODY5MTEsImV4cCI6MjA1Mjk2MjkxMX0.xQwL4vYJHxKJqN8YRq8ZQyF0xGqN6Z5rQqLqH4sVJKo
```

You can also find them in Supabase:
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (under "Project Configuration")
   - **anon/public key** (under "Project API keys")

#### 4.2 Add to Vercel

1. Go to https://vercel.com
2. Go to your project dashboard
3. Click **Settings**
4. Click **Environment Variables** (left sidebar)
5. Add these variables:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://eizzbqsaqjxfywdwvhzy.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your full key) |

**For each variable:**
- Click **Add New**
- Enter the key name
- Paste the value
- Select environment: **Production**, **Preview**, and **Development** (check all)
- Click **Save**

### Step 5: Deploy to Vercel

#### Option A: Auto Deploy (If connected to GitHub)

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Add Supabase auth and package management"
   git push origin main
   ```

2. Vercel will automatically deploy!
3. Check the deployment at: https://vercel.com/dashboard

#### Option B: Manual Deploy

1. Build your project:
   ```bash
   cd client
   npm run build
   ```

2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

3. Follow the prompts

### Step 6: Test Production Deployment

Once deployed, test everything:

#### Test 1: Public Pricing Page
1. Go to: `https://your-domain.vercel.app/pricing`
2. You should see the 3 default packages
3. Images should load (or show placeholder if no images yet)

#### Test 2: Admin Login
1. Go to: `https://your-domain.vercel.app/admin/login`
2. Login with your production admin email and password
3. Should redirect to dashboard

#### Test 3: Package Management
1. In admin panel, go to **Packages**
2. Try creating a new package
3. Upload an image
4. Save and verify it appears on public page

#### Test 4: Image Upload
1. Edit a package
2. Upload a test image
3. Save
4. Go to public pricing page
5. Image should appear in carousel

### Step 7: Clean Up Default Packages

Once everything works, clean up the default packages:

1. Login to admin panel (production URL)
2. Go to **Packages**
3. Delete or edit the 3 default packages
4. Create your real packages with real information
5. Upload high-quality images

## Production Configuration Summary

### Supabase (Production)
- ✅ Project URL: `https://eizzbqsaqjxfywdwvhzy.supabase.co`
- ✅ Database: PostgreSQL with packages table
- ✅ Storage: `package-images` bucket (public)
- ✅ Auth: Email/password authentication

### Vercel (Production)
- ✅ Framework: Vite + React
- ✅ Root Directory: `client`
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Environment Variables: Supabase URL and key

## Important Security Notes

### ✅ Safe to Commit (Already in Git)
- `VITE_SUPABASE_URL` - Public URL
- `VITE_SUPABASE_ANON_KEY` - Public anon key (read-only by design)

### ❌ NEVER Commit
- Service role key (in Supabase Settings > API)
- Admin passwords
- Private API keys

### 🔒 Security Best Practices
1. **Use Row Level Security (RLS)** - Already configured!
2. **Strong admin password** - Use password manager
3. **Enable MFA** - Optional but recommended
4. **Monitor auth logs** - Check Supabase dashboard
5. **Limit file upload sizes** - Already set to 5MB

## Troubleshooting Production Issues

### Issue: Can't login to production admin

**Solutions:**
1. Verify admin user exists in Supabase Auth
2. Check user email is confirmed (email_confirmed_at is set)
3. Try password reset if needed
4. Check browser console for errors
5. Verify Vercel env vars are set correctly

### Issue: Packages not showing on production

**Solutions:**
1. Check SQL schema ran successfully
2. Verify RLS policies are active
3. Check browser network tab for API errors
4. Look at Supabase logs (Dashboard > Logs)

### Issue: Images not uploading

**Solutions:**
1. Verify storage bucket exists and is PUBLIC
2. Check storage policies are set
3. Verify file size under 5MB
4. Check allowed MIME types
5. Look at browser console errors

### Issue: "Not found" on Vercel

**Solutions:**
1. Check Vercel project settings
2. Verify root directory is set to `client`
3. Check build output directory is `dist`
4. Review deployment logs in Vercel

## Vercel Configuration File

Create this file to ensure correct deployment:

**File:** `client/vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Post-Deployment Checklist

- [ ] Supabase database schema deployed
- [ ] Storage bucket created and public
- [ ] Storage policies configured
- [ ] Admin user created in Supabase Auth
- [ ] Vercel environment variables set
- [ ] Site deployed to Vercel
- [ ] Can access public pricing page
- [ ] Can login to admin panel
- [ ] Can create/edit/delete packages
- [ ] Can upload images
- [ ] Images appear on public page
- [ ] Default packages removed/edited
- [ ] Real packages created with images

## Monitoring & Maintenance

### Monitor Supabase Usage
1. Go to Supabase Dashboard → **Settings** → **Usage**
2. Check:
   - Database size
   - Storage size
   - Bandwidth usage
   - Number of auth users

### Monitor Vercel Deployments
1. Go to Vercel Dashboard
2. Check:
   - Build status
   - Analytics
   - Error logs
   - Performance

### Regular Maintenance
- Update packages seasonally
- Add new high-quality images
- Monitor and respond to booking inquiries
- Keep dependencies updated

## Custom Domain Setup (Optional)

If you want to use your own domain:

1. Go to Vercel Dashboard → **Settings** → **Domains**
2. Click **Add**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

## Next Steps After Deployment

1. ✅ Test everything thoroughly
2. ✅ Create your real packages
3. ✅ Upload high-quality images
4. ✅ Update booking link if needed
5. ✅ Share your live site!

## Your Production URLs

Once deployed, you'll have:

- **Website:** `https://your-project-name.vercel.app`
- **Admin Login:** `https://your-project-name.vercel.app/admin/login`
- **Pricing Page:** `https://your-project-name.vercel.app/pricing`
- **Supabase Dashboard:** `https://app.supabase.com/project/eizzbqsaqjxfywdwvhzy`

---

## Quick Reference

### To Deploy Updates:
```bash
git add .
git commit -m "Your update message"
git push origin main
```
Vercel auto-deploys!

### To Test Locally Before Deploy:
```bash
cd client
npm run build
npm run preview
```

### To View Production Logs:
- Vercel: Dashboard → Your Project → Deployments → Latest → Logs
- Supabase: Dashboard → Logs

---

You're all set for production! 🚀

Follow the steps above in order, and your site will be live with full Supabase integration!
