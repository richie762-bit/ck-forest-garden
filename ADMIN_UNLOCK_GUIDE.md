# Admin Guide: Managing Login Lockouts

## Overview

Login lockouts are now stored in the **Supabase database** (`login_attempts` table), allowing you to view and manage locked accounts directly from the database or SQL editor.

## Database Structure

### `login_attempts` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `email` | VARCHAR(255) | Email address of the account |
| `attempt_count` | INTEGER | Number of consecutive failed attempts |
| `locked_until` | TIMESTAMPTZ | When the lockout expires (NULL if not locked) |
| `last_attempt_at` | TIMESTAMPTZ | Timestamp of most recent login attempt |
| `created_at` | TIMESTAMPTZ | When the record was created |
| `updated_at` | TIMESTAMPTZ | When the record was last updated |

## Viewing Locked Accounts

### View All Currently Locked Accounts

```sql
SELECT
  email,
  attempt_count,
  locked_until,
  last_attempt_at,
  (locked_until - NOW()) AS time_remaining
FROM login_attempts
WHERE locked_until IS NOT NULL
  AND locked_until > NOW()
ORDER BY locked_until DESC;
```

### View All Login Attempt Records

```sql
SELECT
  email,
  attempt_count,
  CASE
    WHEN locked_until IS NOT NULL AND locked_until > NOW() THEN 'LOCKED'
    ELSE 'ACTIVE'
  END AS status,
  locked_until,
  last_attempt_at
FROM login_attempts
ORDER BY last_attempt_at DESC;
```

### Check Specific Account

```sql
SELECT
  email,
  attempt_count,
  locked_until,
  CASE
    WHEN locked_until IS NOT NULL AND locked_until > NOW()
    THEN EXTRACT(MINUTE FROM (locked_until - NOW())) || ' minutes remaining'
    ELSE 'Not locked'
  END AS lockout_status
FROM login_attempts
WHERE email = 'user@example.com';
```

## Unlocking Accounts

### Method 1: Unlock Specific Account (SQL)

```sql
UPDATE login_attempts
SET attempt_count = 0,
    locked_until = NULL
WHERE email = 'user@example.com';
```

### Method 2: Unlock All Accounts (SQL)

```sql
UPDATE login_attempts
SET attempt_count = 0,
    locked_until = NULL
WHERE locked_until IS NOT NULL;
```

### Method 3: Delete Specific Account Record

```sql
DELETE FROM login_attempts
WHERE email = 'user@example.com';
```

**Note**: Deleting the record will reset the account completely. The next login attempt will start fresh.

### Method 4: Using Built-in Function

```sql
-- Use the cleanup function to auto-clear expired lockouts
SELECT cleanup_expired_lockouts();
```

This function automatically clears all expired lockouts and returns the number of accounts unlocked.

## Common Administrative Tasks

### 1. Emergency Unlock (User Locked Out)

If a legitimate user reports being locked out and needs immediate access:

```sql
-- Check their status first
SELECT * FROM login_attempts WHERE email = 'user@example.com';

-- Unlock the account
UPDATE login_attempts
SET attempt_count = 0,
    locked_until = NULL
WHERE email = 'user@example.com';
```

### 2. Monitor Failed Login Attempts

View accounts with failed attempts (not yet locked):

```sql
SELECT
  email,
  attempt_count,
  last_attempt_at
FROM login_attempts
WHERE locked_until IS NULL
  AND attempt_count > 0
ORDER BY attempt_count DESC, last_attempt_at DESC;
```

### 3. Identify Potential Security Issues

View accounts with multiple lockouts:

```sql
SELECT
  email,
  attempt_count,
  last_attempt_at,
  created_at
FROM login_attempts
WHERE attempt_count >= 3
ORDER BY last_attempt_at DESC
LIMIT 20;
```

### 4. Cleanup Old Records

Remove records older than 30 days with no recent activity:

```sql
DELETE FROM login_attempts
WHERE last_attempt_at < NOW() - INTERVAL '30 days'
  AND locked_until IS NULL;
```

## Automated Maintenance

### Schedule Automatic Cleanup (Optional)

You can set up a cron job or scheduled function to automatically clean up expired lockouts:

```sql
-- Run this every hour via pg_cron or external scheduler
SELECT cleanup_expired_lockouts();
```

## Security Best Practices

### 1. Monitor for Attacks

Regularly check for patterns indicating brute force attacks:

```sql
-- Accounts with lockouts in the last hour
SELECT
  email,
  attempt_count,
  locked_until,
  last_attempt_at
FROM login_attempts
WHERE last_attempt_at > NOW() - INTERVAL '1 hour'
  AND attempt_count >= 3
ORDER BY last_attempt_at DESC;
```

### 2. Alert on Multiple Lockouts

If you see the same email being locked repeatedly:

```sql
-- Check if an email has been locked multiple times recently
SELECT
  email,
  COUNT(*) as lockout_attempts,
  MAX(last_attempt_at) as most_recent
FROM login_attempts
WHERE locked_until IS NOT NULL
  AND last_attempt_at > NOW() - INTERVAL '24 hours'
GROUP BY email
HAVING COUNT(*) > 2
ORDER BY lockout_attempts DESC;
```

This could indicate:
- User forgot their password (help them reset it)
- Potential attack on that specific account

### 3. Review Lockout Frequency

```sql
-- Count lockouts per day over the last week
SELECT
  DATE(last_attempt_at) as lockout_date,
  COUNT(*) as total_lockouts
FROM login_attempts
WHERE locked_until IS NOT NULL
  AND last_attempt_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(last_attempt_at)
ORDER BY lockout_date DESC;
```

If you see spikes, it may indicate:
- Credential stuffing attack
- Password policy is too complex
- Users need better training

## Troubleshooting

### User Says They're Locked But Database Shows Otherwise

1. **Check the database first**:
```sql
SELECT * FROM login_attempts WHERE email = 'user@example.com';
```

2. **Clear any potential cache**:
```sql
-- Force update to trigger any listeners
UPDATE login_attempts
SET updated_at = NOW()
WHERE email = 'user@example.com';
```

3. **Have user try again** - Lockouts are checked in real-time from database

### Database Shows Locked But Time Has Expired

The system auto-clears expired lockouts, but you can manually trigger it:

```sql
-- Clear all expired lockouts
UPDATE login_attempts
SET attempt_count = 0,
    locked_until = NULL
WHERE locked_until IS NOT NULL
  AND locked_until < NOW();
```

### Need to Temporarily Disable Lockouts for Testing

**Option 1**: Increase threshold temporarily in code (not recommended for production)

**Option 2**: Clear all lockouts before testing:
```sql
UPDATE login_attempts SET attempt_count = 0, locked_until = NULL;
```

**Option 3**: Delete test account records after each test:
```sql
DELETE FROM login_attempts WHERE email LIKE '%test%';
```

## Quick Reference

### Most Common Commands

```sql
-- View all locked accounts
SELECT email, locked_until FROM login_attempts
WHERE locked_until > NOW();

-- Unlock specific account
UPDATE login_attempts
SET attempt_count = 0, locked_until = NULL
WHERE email = 'user@example.com';

-- Clear all expired lockouts
SELECT cleanup_expired_lockouts();

-- Delete old records (30+ days)
DELETE FROM login_attempts
WHERE last_attempt_at < NOW() - INTERVAL '30 days';
```

## Direct Supabase Dashboard Access

### Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Run any of the SQL commands above
4. Click **RUN** to execute

### Using Table Editor

1. Go to **Table Editor** in Supabase dashboard
2. Select `login_attempts` table
3. Find the user's row
4. Edit the row:
   - Set `attempt_count` to `0`
   - Set `locked_until` to `NULL`
5. Save changes

## API Integration (Future Enhancement)

If you want to build an admin panel, you can use the `unlockAccount` function:

```javascript
import { unlockAccount } from './services/supabaseService';

// Unlock account programmatically
await unlockAccount('user@example.com');
```

---

## Support

If you encounter issues:

1. Check the `login_attempts` table directly
2. Review the SQL queries in this guide
3. Check Supabase logs for any database errors
4. Ensure RLS policies allow admin access

**Last Updated**: January 2026
**Version**: 1.0
