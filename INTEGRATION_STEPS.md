# Supabase Integration Steps

## You already have Supabase set up - here's how to integrate it:

### Step 1: Update Database Schema (5 minutes)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **eizzbqsaqjxfywdwvhzy**
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the contents of `supabase-schema.sql` and paste it into the editor
6. Click **Run** (or press Ctrl+Enter)

This will:
- Create the `bookings` table if it doesn't exist
- Add any missing columns if the table already exists
- Set up all necessary indexes
- Configure Row Level Security policies

### Step 2: Set Up Storage Bucket (2 minutes)

1. In Supabase Dashboard, click **Storage** in the left sidebar
2. Click **Create a new bucket**
3. Name: `booking-receipts`
4. Make it **Public** (check the "Public bucket" option)
5. Click **Create bucket**

#### Set Storage Policies:

After creating the bucket, click on it and go to **Policies** tab:

**Policy 1: Allow Public Uploads**
```sql
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'booking-receipts');
```

**Policy 2: Allow Public Reads**
```sql
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
USING (bucket_id = 'booking-receipts');
```

### Step 3: Verify Vercel Environment Variables (1 minute)

The environment variables are already in your code:
- `VITE_SUPABASE_URL=https://eizzbqsaqjxfywdwvhzy.supabase.co`
- `VITE_SUPABASE_ANON_KEY=eyJhbG...` (already set)

Just make sure they're also set in **Vercel Dashboard**:
1. Go to your Vercel project settings
2. Click **Environment Variables**
3. Add both variables if not already there

### Step 4: Deploy to Vercel (1 minute)

The code is already committed and pushed. Just redeploy:
1. Go to Vercel Dashboard
2. Click your project
3. Go to **Deployments** tab
4. Click the three dots on the latest commit
5. Click **Redeploy**

### Step 5: Test the Booking Flow (2 minutes)

1. Visit your live site
2. Click "Book Your Visit" button
3. Fill out the form
4. Upload a test receipt image
5. Click "Book Now"
6. Check Supabase Dashboard → Table Editor → bookings table to see the new record
7. Check Storage → booking-receipts to see the uploaded receipt

---

## What's Already Done ✅

- ✅ Supabase client installed
- ✅ Supabase configuration created
- ✅ Booking form with receipt upload
- ✅ Payment instructions displayed
- ✅ Add-ons selection (Meals, Transportation, Tour Guide)
- ✅ Date locking based on confirmed bookings
- ✅ Hero and Pricing buttons updated to open modal
- ✅ Environment variables configured
- ✅ Code committed and pushed to GitHub

## What You Need to Do 📋

1. [ ] Run `supabase-schema.sql` in Supabase SQL Editor
2. [ ] Create `booking-receipts` storage bucket (make it public)
3. [ ] Set up storage policies
4. [ ] Verify Vercel environment variables
5. [ ] Redeploy on Vercel
6. [ ] Test a booking

---

## Quick Reference

### Supabase Dashboard
https://supabase.com/dashboard/project/eizzbqsaqjxfywdwvhzy

### Table Name
`bookings`

### Storage Bucket
`booking-receipts` (must be public)

### Environment Variables
```
VITE_SUPABASE_URL=https://eizzbqsaqjxfywdwvhzy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpenpicXNhcWp4Znl3ZHd2aHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczODY5MTEsImV4cCI6MjA1Mjk2MjkxMX0.xQwL4vYJHxKJqN8YRq8ZQyF0xGqN6Z5rQqLqH4sVJKo
```

---

## Troubleshooting

### Issue: Can't insert bookings
**Solution:** Make sure RLS policies are set up (run the SQL script)

### Issue: Can't upload receipts
**Solution:** Make sure the bucket is **public** and storage policies are set

### Issue: Dates not blocking
**Solution:** Change booking_status to 'confirmed' for test bookings in Supabase table editor

### Issue: Environment variables not working
**Solution:** Make sure they're set in Vercel and redeploy after adding them

---

## Need Help?

If you run into issues:
1. Check the browser console for errors (F12)
2. Check Supabase logs in Dashboard → Logs
3. Verify the table structure matches the schema
4. Make sure storage bucket is public
5. Ensure environment variables are set in Vercel
