# Testing Supabase Authentication - Quick Guide

## Step 1: Create Admin User in Supabase (Do This First!)

### Using Supabase Dashboard (Easiest)

1. Go to https://app.supabase.com
2. Select your project: `eizzbqsaqjxfywdwvhzy`
3. Click **Authentication** in left sidebar
4. Click **Users** tab
5. Click **Add user** button (green, top right)
6. Select **Create new user**
7. Fill in:
   - **Email:** `admin@ckforestgarden.com`
   - **Password:** `Admin123!@#` (or choose your own secure password)
   - **Auto Confirm User:** Toggle this ON (important!)
8. Click **Create user**

**IMPORTANT:** Write down your password! You'll need it to login.

### Alternative: Using SQL

If you prefer SQL, run this in Supabase SQL Editor:

```sql
-- Create admin user with password: Admin123!@#
-- Change the password if you want a different one
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
  crypt('Admin123!@#', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin User"}',
  false,
  ''
);
```

## Step 2: Test the Login

1. **Make sure your client is running:**
   ```bash
   cd client
   npm run dev
   ```

2. **Go to login page:**
   - Open: http://localhost:5173/admin/login

3. **Enter credentials:**
   - Email: `admin@ckforestgarden.com`
   - Password: `Admin123!@#` (or whatever you set)

4. **Click "Sign In"**
   - You should see "Login successful!" toast
   - You should be redirected to `/admin/dashboard`

## Step 3: Test the Dashboard

After successful login:

1. **Check the header:**
   - Your email should appear in the top right
   - You should see the first letter of your email in the avatar circle

2. **Test navigation:**
   - Click **Dashboard** - should show dashboard stats
   - Click **Bookings** - should show bookings list
   - Click **Packages** - should show package management

3. **Test logout:**
   - Click **Logout** button in sidebar
   - You should see "Logged out successfully" toast
   - You should be redirected to login page

## Step 4: Test Protected Routes

1. **Logout if logged in**

2. **Try to access protected route directly:**
   - Go to: http://localhost:5173/admin/dashboard
   - You should be redirected to login page

3. **Login and access should work**

## Troubleshooting

### "Invalid login credentials" error

**Problem:** Email or password is wrong, or user doesn't exist.

**Solutions:**
1. Double-check you created the user in Supabase
2. Verify the email matches exactly: `admin@ckforestgarden.com`
3. Check you used the correct password
4. In Supabase Dashboard > Auth > Users, verify the user exists
5. Make sure "Auto Confirm User" was toggled ON

### "Network error" or no response

**Problem:** Can't connect to Supabase.

**Solutions:**
1. Check your internet connection
2. Verify `client/.env` has correct Supabase URL and anon key
3. Check browser console for errors
4. Verify your Supabase project is active

### User created but can't login

**Problem:** Email might not be confirmed.

**Solutions:**
1. Go to Supabase Dashboard > Auth > Users
2. Find your user
3. Check if `email_confirmed_at` has a value
4. If not, click the user and manually confirm the email

### Redirects to login after successful login

**Problem:** Session not being saved properly.

**Solutions:**
1. Clear browser localStorage and cookies
2. Check browser console for errors
3. Verify Supabase URL and anon key are correct
4. Try in incognito/private mode

### "User already exists" when creating

**Problem:** User was already created.

**Solutions:**
1. Go to Supabase Dashboard > Auth > Users
2. Find the existing user
3. Either use that user, or delete it and create a new one

## What's Different Now?

### Before (Server-based Auth):
- ❌ Needed to run Express server
- ❌ Manual JWT token management
- ❌ localStorage for sessions
- ❌ Server API calls for login/logout

### Now (Supabase Auth):
- ✅ No server needed for authentication
- ✅ Automatic token refresh
- ✅ Secure session management by Supabase
- ✅ Built-in security features
- ✅ Direct Supabase integration

## Success Checklist

- [ ] Admin user created in Supabase
- [ ] Can login with email and password
- [ ] Redirected to dashboard after login
- [ ] Email shows in dashboard header
- [ ] Can navigate between admin pages
- [ ] Can logout successfully
- [ ] Protected routes work (redirect to login when not authenticated)
- [ ] Can create/edit/delete packages (package management works)

## Your Credentials

Write them down here for reference:

- **Email:** `admin@ckforestgarden.com`
- **Password:** `_________________` (write your password here)

**Keep this secure!**

## Next Steps After Testing

Once everything works:

1. ✅ You no longer need to run the server for login!
2. ✅ Just run `cd client && npm run dev`
3. ✅ Package management uses Supabase directly
4. ✅ Authentication uses Supabase Auth
5. Consider adding more features:
   - Password reset functionality
   - Email verification
   - Multi-factor authentication (MFA)
   - Additional admin users

## Deploy to Production

When ready to deploy:

1. Create admin user in **production** Supabase project
2. Update production environment variables
3. Deploy client to Vercel
4. Test login on production URL

You're done! 🎉
