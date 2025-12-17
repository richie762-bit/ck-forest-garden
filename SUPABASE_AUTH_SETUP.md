# Supabase Authentication Setup Guide

This guide will help you migrate from server-side JWT authentication to Supabase Auth.

## Step 1: Create Admin User in Supabase

### Option A: Using Supabase Dashboard (Recommended)

1. Go to https://app.supabase.com and open your project
2. Navigate to **Authentication** (left sidebar)
3. Click on **Users** tab
4. Click **Add user** button (top right)
5. Select **Create new user**
6. Fill in the form:
   - **Email:** `admin@ckforestgarden.com`
   - **Password:** Choose a strong password (e.g., `Admin123!@#`)
   - **Auto Confirm User:** Toggle ON (so you don't need email confirmation)
7. Click **Create user**
8. **IMPORTANT:** Copy and save your password securely!

### Option B: Using SQL

Run this in the SQL Editor:

```sql
-- Create admin user
-- Replace 'your-secure-password' with your desired password
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@ckforestgarden.com',
  crypt('your-secure-password', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin User"}',
  false,
  ''
);
```

## Step 2: Configure Email Settings (Optional)

If you want email confirmation and password reset features:

1. Go to **Authentication** > **Settings** > **Email Auth**
2. Enable **Confirm email**
3. Configure your email provider (SMTP)
4. Or use Supabase's built-in email service

For development, you can disable email confirmation (already done in Step 1 with "Auto Confirm User").

## Step 3: Set Up Auth Policies

Your packages table already has RLS policies for `authenticated` users. Verify them:

```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'packages';
```

You should see policies that allow `authenticated` role to:
- SELECT all packages
- INSERT packages
- UPDATE packages
- DELETE packages

## Step 4: Test Authentication

After updating the code (I'll do this next), test the login:

1. Go to http://localhost:5173/admin/login
2. Enter: `admin@ckforestgarden.com`
3. Enter your password
4. You should be redirected to the admin dashboard

## What Changes in the Code

The authentication context will now:
- ✅ Use Supabase's `signInWithPassword()` instead of server API
- ✅ Use Supabase's `signOut()` for logout
- ✅ Listen to Supabase's `onAuthStateChange()` for session management
- ✅ Store session in Supabase (more secure than localStorage)
- ✅ Auto-refresh tokens (handled by Supabase)

## Benefits of Supabase Auth

1. **No Server Required:** Authentication works without running Express server
2. **Secure:** Passwords are hashed with bcrypt by Supabase
3. **Session Management:** Auto-refresh tokens, persistent sessions
4. **Built-in Features:** Password reset, email verification, etc.
5. **RLS Integration:** Works seamlessly with Row Level Security
6. **Scalable:** Handles authentication at any scale

## Environment Variables

Make sure your `client/.env` has:

```env
VITE_SUPABASE_URL=https://eizzbqsaqjxfywdwvhzy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## After Migration

Once migrated, you can:
- ✅ Stop running the server (unless you need it for other features)
- ✅ Remove server authentication routes
- ✅ Simplify deployment (just deploy the client)
- ✅ Use Supabase's built-in auth features

## Rollback Plan

If something goes wrong:
1. The old code is in git history
2. You can revert the AuthContext changes
3. Start the server again with `npm run dev`
4. Old login will work again

## Security Best Practices

1. **Use Strong Passwords:** For admin accounts
2. **Enable MFA:** Supabase supports multi-factor authentication
3. **Set Up Email Verification:** For production
4. **Configure Auth Policies:** Restrict who can sign up
5. **Use Environment Variables:** Never commit secrets to git

## Next Steps

After I update the code:
1. Create the admin user in Supabase (Step 1 above)
2. Test the login
3. If it works, you can stop running the server!
