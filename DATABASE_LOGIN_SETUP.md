# Database-Based Login Lockout Setup Guide

## Overview

This guide walks you through setting up the database-based login lockout system for CK Forest Garden.

## Prerequisites

- Supabase project already set up
- Database connection configured in `client/src/config/supabase.js`
- Admin access to Supabase dashboard

## Setup Steps

### Step 1: Create the Database Table

Run the migration SQL file to create the `login_attempts` table:

**Option A: Using Supabase SQL Editor**

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `supabase-migrations/create_login_attempts.sql`
5. Paste into the SQL Editor
6. Click **RUN** to execute

**Option B: Using psql or Database Client**

```bash
psql -h your-supabase-host -U postgres -d postgres -f supabase-migrations/create_login_attempts.sql
```

### Step 2: Verify Table Creation

Check that the table was created successfully:

```sql
-- Verify table exists
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'login_attempts'
ORDER BY ordinal_position;

-- Verify indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'login_attempts';

-- Verify RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'login_attempts';
```

Expected output:
- Table `login_attempts` with 7 columns (id, email, attempt_count, locked_until, last_attempt_at, created_at, updated_at)
- 2 indexes (idx_login_attempts_email, idx_login_attempts_locked_until)
- RLS enabled: `t` (true)

### Step 3: Verify RLS Policies

Check that Row Level Security policies are in place:

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'login_attempts';
```

Expected policies:
1. `Allow public read access to login attempts` (SELECT)
2. `Allow public insert to login attempts` (INSERT)
3. `Allow public update to login attempts` (UPDATE)
4. `Allow authenticated users to delete login attempts` (DELETE)

### Step 4: Test Basic Functionality

Test the table by inserting and querying a test record:

```sql
-- Insert test record
INSERT INTO login_attempts (email, attempt_count)
VALUES ('test@example.com', 1);

-- Query test record
SELECT * FROM login_attempts WHERE email = 'test@example.com';

-- Update test record
UPDATE login_attempts
SET attempt_count = 2
WHERE email = 'test@example.com';

-- Verify update
SELECT * FROM login_attempts WHERE email = 'test@example.com';

-- Clean up test record
DELETE FROM login_attempts WHERE email = 'test@example.com';
```

### Step 5: Verify Application Integration

The application code has been updated to use the database. Verify the integration:

1. **Check imports in AuthContext.jsx**:
```javascript
import {
  checkLoginLockout,
  recordFailedLoginAttempt,
  clearLoginAttempts
} from '../services/supabaseService';
```

2. **Check imports in Login.jsx**:
```javascript
import { checkLoginLockout } from '../../services/supabaseService';
```

3. **Verify service functions exist in supabaseService.js**:
   - `getLoginAttempts(email)`
   - `recordFailedLoginAttempt(email)`
   - `checkLoginLockout(email)`
   - `clearLoginAttempts(email)`
   - `unlockAccount(email)`

### Step 6: Test the Complete Flow

Test the login lockout functionality:

1. **Start the application**:
```bash
cd client
npm install  # if needed
npm run dev
```

2. **Test failed login attempts**:
   - Navigate to the login page (usually `/admin/login`)
   - Enter incorrect credentials
   - After 1st attempt: You should see an amber security notice
   - After 2nd attempt: You should see a warning about final attempt
   - After 3rd attempt: Account should lock for 15 minutes

3. **Verify in database**:
```sql
-- Check the login attempts record
SELECT * FROM login_attempts WHERE email = 'your-test-email@example.com';
```

You should see:
- `attempt_count`: 3
- `locked_until`: A timestamp 15 minutes in the future

4. **Test unlock from database**:
```sql
-- Unlock the test account
UPDATE login_attempts
SET attempt_count = 0,
    locked_until = NULL
WHERE email = 'your-test-email@example.com';
```

5. **Verify unlock**:
   - Refresh the login page
   - The lockout message should disappear
   - You can attempt to login again

### Step 7: Test Successful Login

1. Enter correct credentials
2. Login should succeed
3. Verify in database that attempts were cleared:
```sql
SELECT * FROM login_attempts WHERE email = 'your-email@example.com';
```

The record should show:
- `attempt_count`: 0
- `locked_until`: NULL

## Troubleshooting

### Issue: Table creation fails with "already exists" error

**Solution**: Table already exists. Skip to verification steps.

### Issue: RLS policies prevent updates

**Solution**: Re-run the policy creation section of the migration:

```sql
-- Drop and recreate policies
DROP POLICY IF EXISTS "Allow public read access to login attempts" ON login_attempts;
DROP POLICY IF EXISTS "Allow public insert to login attempts" ON login_attempts;
DROP POLICY IF EXISTS "Allow public update to login attempts" ON login_attempts;
DROP POLICY IF EXISTS "Allow authenticated users to delete login attempts" ON login_attempts;

-- Create policies (see create_login_attempts.sql for full SQL)
```

### Issue: Application shows "table or view not found"

**Possible causes**:
1. Table not created in correct schema
2. Supabase connection not configured correctly
3. RLS policies too restrictive

**Solution**:
1. Verify table exists: `SELECT * FROM login_attempts LIMIT 1;`
2. Check Supabase connection in `client/src/config/supabase.js`
3. Verify RLS policies allow public SELECT, INSERT, UPDATE

### Issue: Lockout not working across devices

**Solution**: This is expected! Database-based lockouts work across all devices. Test by:
1. Fail login 3 times on Device A
2. Try to login on Device B
3. Should also be locked

### Issue: Cleanup function fails

**Solution**: Re-create the cleanup function:

```sql
CREATE OR REPLACE FUNCTION cleanup_expired_lockouts()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  UPDATE login_attempts
  SET locked_until = NULL,
      attempt_count = 0
  WHERE locked_until IS NOT NULL
    AND locked_until < NOW();

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
```

## Migration from LocalStorage (Previous Version)

If you were using the localStorage version before:

1. **Clear old localStorage data** (optional cleanup):
```javascript
// Run in browser console on login page
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('login_lockout_') || key.startsWith('login_attempts_')) {
    localStorage.removeItem(key);
  }
});
```

2. **No data migration needed**: The database version starts fresh. Old localStorage lockouts will simply expire on their own.

## Post-Setup Verification Checklist

- [ ] Database table `login_attempts` created
- [ ] Indexes created (email, locked_until)
- [ ] RLS enabled and policies configured
- [ ] Test record can be inserted/updated/deleted
- [ ] Application imports correct service functions
- [ ] Failed login creates database record
- [ ] 3rd failed attempt triggers 15-minute lockout
- [ ] Lockout enforced across devices/browsers
- [ ] Successful login clears attempt count
- [ ] Manual unlock from database works
- [ ] Countdown timer displays correctly

## Admin Access

Once setup is complete, you can manage lockouts using:

1. **Supabase Dashboard** → SQL Editor (run queries)
2. **Supabase Dashboard** → Table Editor (visual editing)
3. **SQL Commands** (see [ADMIN_UNLOCK_GUIDE.md](ADMIN_UNLOCK_GUIDE.md))

## Quick Reference Commands

```sql
-- View all locked accounts
SELECT email, locked_until FROM login_attempts WHERE locked_until > NOW();

-- Unlock specific account
UPDATE login_attempts SET attempt_count = 0, locked_until = NULL WHERE email = 'user@example.com';

-- Clear all expired lockouts
SELECT cleanup_expired_lockouts();

-- View recent failed attempts
SELECT email, attempt_count, last_attempt_at FROM login_attempts ORDER BY last_attempt_at DESC LIMIT 10;
```

## Support

For detailed administrative tasks, see [ADMIN_UNLOCK_GUIDE.md](ADMIN_UNLOCK_GUIDE.md)

For security implementation details, see [LOGIN_SECURITY.md](LOGIN_SECURITY.md)

---

**Last Updated**: January 2026
**Version**: 1.0
