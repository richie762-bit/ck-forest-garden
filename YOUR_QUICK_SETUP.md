# ⚡ Your Quick Setup Guide

**Your Supabase Project:** `xkshddqapghffhiaqvtc`

---

## 🎯 Do These 4 Things (10 minutes)

### 1️⃣ Get Your API Key

1. Go here: https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc/settings/api

2. Find **"anon public"** key (long string starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

3. Copy it

4. Open `client/.env` file

5. Replace line 6:
   ```
   VITE_SUPABASE_ANON_KEY=paste-your-key-here
   ```

---

### 2️⃣ Run Database Setup

1. Go here: https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc/sql/new

2. Open your local file: `supabase-packages-schema.sql`

3. Copy EVERYTHING

4. Paste in Supabase SQL Editor

5. Click "Run"

---

### 3️⃣ Create Storage Bucket

1. Go here: https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc/storage/buckets

2. Click "Create a new bucket"

3. Name: `package-images`

4. Toggle "Public bucket" **ON**

5. Click "Create bucket"

6. Then run this SQL:

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

---

### 4️⃣ Create Admin User

1. Go here: https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc/auth/users

2. Click "Add user" → "Create new user"

3. Email: `admin@ckforestgarden.com`

4. Password: [Choose strong password!]

5. Toggle "Auto Confirm User" **ON**

6. Click "Create user"

7. **Write down your password!**

---

## ✅ Test It Works

```bash
cd client
npm run dev
```

Go to: http://localhost:5173/admin/login

Login with your email and password!

---

## 🚀 Deploy to Production

### Update Vercel

1. Go to Vercel → Your Project → Settings → Environment Variables

2. Add/Update:
   - `VITE_SUPABASE_URL` = `https://xkshddqapghffhiaqvtc.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = [your key from step 1]

3. Deploy:
   ```bash
   git add .
   git commit -m "Update Supabase project"
   git push origin main
   ```

---

## 📚 Need More Help?

Read: `SETUP_YOUR_SUPABASE.md` for detailed instructions

---

**Your project:** https://supabase.com/dashboard/project/xkshddqapghffhiaqvtc

That's it! 🎉
