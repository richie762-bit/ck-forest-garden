# 🚀 START HERE - Supabase Migration

Your website has been migrated to Supabase! Follow these 3 quick steps to get started.

## ⚡ 3 Steps to Get Started (5 minutes)

### Step 1: Create Admin User in Supabase

1. Go to https://app.supabase.com
2. Click **Authentication** → **Users**
3. Click **Add user** → **Create new user**
4. Enter:
   - Email: `admin@ckforestgarden.com`
   - Password: Choose a secure password (write it down!)
   - **Auto Confirm User:** Toggle ON
5. Click **Create user**

### Step 2: Run Database Setup

1. In Supabase, click **SQL Editor**
2. Click **New Query**
3. Open file: `supabase-packages-schema.sql`
4. Copy ALL contents
5. Paste into SQL Editor
6. Click **Run**

### Step 3: Create Storage Bucket

1. In Supabase, click **Storage**
2. Click **Create a new bucket**
3. Name: `package-images`
4. **Public bucket:** Toggle ON
5. Click **Create bucket**

Then run this SQL for storage policies:

```sql
CREATE POLICY "Public can view package images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'package-images');

CREATE POLICY "Authenticated users can upload package images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'package-images');

CREATE POLICY "Authenticated users can delete package images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'package-images');
```

## ✅ Test It Works

```bash
# Start the client (no need for server!)
cd client
npm run dev
```

Then:
1. Go to: http://localhost:5173/admin/login
2. Login with the email and password you created
3. You should see the admin dashboard!

## 🎯 What to Read Next

| If you want to... | Read this file |
|-------------------|----------------|
| Quick 5-minute setup | `QUICK_START.md` |
| Test the login | `SUPABASE_AUTH_TEST.md` |
| Understand the system | `PACKAGE_SYSTEM_README.md` |
| Complete migration details | `MIGRATION_GUIDE.md` |
| Understand what changed | `SUPABASE_MIGRATION_COMPLETE.md` |

## 🆘 Common Issues

**Can't login?**
- Make sure you created the admin user in Supabase
- Check you toggled "Auto Confirm User" ON
- Verify email and password are correct

**Packages not loading?**
- Check you ran the SQL schema
- Verify the SQL ran without errors
- Check browser console for errors

**Images not uploading?**
- Make sure storage bucket is created
- Verify bucket is set to PUBLIC
- Run the storage policies SQL

## 📚 Full Documentation

All documentation is in these files:
- `START_HERE.md` ← You are here!
- `QUICK_START.md` - 5-minute quick start
- `SUPABASE_AUTH_TEST.md` - Test login guide
- `SUPABASE_AUTH_SETUP.md` - Auth setup details
- `SUPABASE_PACKAGES_SETUP.md` - Package setup details
- `PACKAGE_SYSTEM_README.md` - Complete system docs
- `MIGRATION_GUIDE.md` - Full migration guide
- `SUPABASE_MIGRATION_COMPLETE.md` - What changed summary

## 🎉 You're All Set!

Once you complete the 3 steps above, you can:
- ✅ Login without running a server
- ✅ Create and manage packages
- ✅ Upload images with flashcard UI
- ✅ See dynamic pricing on your website

**Start now:** Follow Step 1 above to create your admin user!
