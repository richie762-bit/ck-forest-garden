# Login Security Implementation

## Overview
This document describes the login rate limiting and account lockout security measures implemented for the CK Forest Garden admin portal.

## Security Standards Compliance

The implementation follows industry-standard cybersecurity best practices:

- **OWASP Authentication Guidelines**: Progressive delays and account lockouts
- **NIST SP 800-63B**: Digital Identity Guidelines for authentication
- **CWE-307**: Improper Restriction of Excessive Authentication Attempts mitigation

## Rate Limiting Strategy

### Progressive Delays

The system implements a progressive delay mechanism that increases with each failed attempt:

| Attempt # | Delay | Message |
|-----------|-------|---------|
| 1 | 2 seconds | Warning with remaining attempts counter + Security notice appears |
| 2 | 5 seconds | Final warning (1 attempt remaining) |
| 3+ | 15 minutes lockout | Account temporarily locked |

### Why Progressive Delays?

1. **User Experience**: Legitimate users aren't penalized on first attempts
2. **Attack Mitigation**: Makes brute force attacks impractical (2-5 second delays multiply across attempts)
3. **Resource Protection**: Prevents rapid-fire authentication requests that could overwhelm the system

## Account Lockout Mechanism

### Lockout Parameters

- **Threshold**: 3 failed attempts
- **Lockout Duration**: 15 minutes
- **Scope**: Per email address (allows legitimate users with different emails)
- **Storage**: Supabase database (`login_attempts` table) - centralized, cross-device tracking

### Security Rationale

**15-Minute Duration**:
- OWASP recommends 15-30 minutes for temporary lockouts
- Long enough to deter automated attacks
- Short enough not to frustrate legitimate users who forgot their password

**3-Attempt Threshold**:
- NIST suggests 3-10 attempts before lockout
- 3 attempts provides strong security while still allowing for a typo or caps lock error

## Implementation Details

### Database Tracking

**Table**: `login_attempts`

| Column | Type | Description |
|--------|------|-------------|
| `email` | VARCHAR(255) | Email address |
| `attempt_count` | INTEGER | Failed attempt count |
| `locked_until` | TIMESTAMPTZ | Lockout expiration |
| `last_attempt_at` | TIMESTAMPTZ | Most recent attempt |

**Why Database Storage?**
- ✅ Centralized management - unlock accounts from database
- ✅ Cross-device enforcement - lockout applies everywhere
- ✅ Audit trail - track all failed login attempts
- ✅ Admin control - view and manage lockouts via SQL
- ✅ Cannot be bypassed by clearing browser data
- ✅ Persistent across sessions and devices

**Benefits Over Client-Side**:
- Administrators can unlock accounts manually from database
- Security team can monitor failed login patterns
- Cross-device protection (user can't switch devices to bypass)
- Centralized security logging and analytics

### Security Features

1. **Automatic Cleanup**: Expired lockouts are automatically removed
2. **Real-time Countdown**: Users see exactly when they can retry
3. **Clear Feedback**: Error messages show remaining attempts
4. **Form Disabling**: Locked accounts cannot submit the form
5. **Visual Indicators**: Red alert box with countdown timer during lockout

## User Experience Features

### Visual Feedback

1. **Security Notice**: Amber warning box that appears after first failed attempt, explaining the 3-attempt policy
2. **Lockout Warning**: Red alert box when account is locked with countdown timer
3. **Attempt Counter**: Error messages show "X attempts remaining before lockout"
4. **Progressive Warnings**: Messages escalate in urgency as attempts increase

### Example User Flow

```
Attempt 1: ⏱️ 2-second delay → ❌ "Invalid email or password. (2 attempts remaining before lockout)"
           → 🟨 Amber security notice appears: "Account will be locked for 15 minutes after 3 failed attempts"
Attempt 2: ⏱️ 5-second delay → ❌ "Warning: Account will be locked after one more failed attempt. (1 attempt remaining)"
Attempt 3: 🔒 15-minute lockout → "Account temporarily locked. Please try again in 15 minutes."
           → 🔴 Red lockout alert with countdown timer (e.g., "Time remaining: 14:57")
```

## Code Architecture

### AuthContext.jsx

**Functions**:
- `login(email, password)`: Enhanced with database-based rate limiting checks
- Uses `checkLoginLockout()` from supabaseService
- Uses `recordFailedLoginAttempt()` to track failures
- Uses `clearLoginAttempts()` on successful login

### supabaseService.js

**Login Attempt Functions**:
- `getLoginAttempts(email)`: Get login attempt record from database
- `recordFailedLoginAttempt(email)`: Record failed attempt with progressive delays
- `checkLoginLockout(email)`: Check current lockout status
- `clearLoginAttempts(email)`: Clear attempts on successful login
- `unlockAccount(email)`: Admin function to manually unlock accounts

### Login.jsx

**Features**:
- Real-time lockout status checking from database
- Countdown timer display
- Form field disabling during lockout
- Visual lockout warnings
- Uses `checkLoginLockout()` to fetch status from database

## Testing the Implementation

### Manual Testing Steps

1. **Test Security Notice Appearance**:
   - Enter wrong password once
   - Verify amber security notice appears after first failed attempt
   - Verify 2-second delay on first attempt

2. **Test Progressive Delays**:
   - Enter wrong password 2 times
   - Observe increasing delays (2s then 5s)
   - Verify warning messages escalate in urgency
   - Verify attempt counter decrements correctly

3. **Test Lockout**:
   - Enter wrong password 3 times total
   - Verify account locks for 15 minutes
   - Verify countdown timer displays and updates
   - Verify form fields are disabled

4. **Test Lockout Expiry**:
   - Wait for lockout to expire (or set shorter duration for testing)
   - Verify form re-enables automatically
   - Verify attempt counter resets

5. **Test Successful Login**:
   - Make 1-2 failed attempts
   - Enter correct credentials
   - Verify attempt counter is cleared
   - Verify security notice disappears
   - Verify no delays on next login

### Testing Different Emails

The rate limiting is per-email, so you can test by:
```
test1@example.com → Lock it out (3 attempts)
test2@example.com → Should work independently
```

## Security Considerations

### What This Protects Against

✅ **Automated brute force attacks** (client-side)
✅ **Password spraying** (one password, many attempts)
✅ **Credential stuffing** (slowed by delays)
✅ **Account enumeration** (same error for all failed attempts)

### What This Doesn't Protect Against

❌ **Distributed attacks** (multiple IPs/devices) - Would need server-side IP tracking
❌ **Sophisticated attackers** who clear localStorage - Still rate-limited by Supabase
❌ **Account takeover** after successful credential theft - Would need MFA

### Additional Recommendations

For enhanced security, consider implementing:

1. **CAPTCHA**: After 2-3 failed attempts
2. **Email Verification**: Send notification emails on failed login attempts
3. **IP-Based Rate Limiting**: Server-side tracking (requires backend changes)
4. **Multi-Factor Authentication (MFA)**: Supabase supports TOTP
5. **Account Recovery**: Secure password reset flow
6. **Audit Logging**: Track all authentication attempts server-side

## Compliance & Standards

### OWASP Top 10 2021

- **A07:2021 - Identification and Authentication Failures**: Mitigated through rate limiting
- **CWE-307**: Improper Restriction of Excessive Authentication Attempts - Addressed

### NIST SP 800-63B Compliance

- ✅ Rate limiting on authentication attempts
- ✅ Progressive delays to slow attackers
- ✅ Clear user feedback
- ✅ Temporary account lockout

### Industry Best Practices

- ✅ Client-side protection as first line of defense
- ✅ 15-minute lockout duration (OWASP recommended 15-30 min)
- ✅ 6-attempt threshold (within NIST recommended 3-10 range)
- ✅ Progressive delays (2s, 5s) before lockout
- ✅ Clear user communication

## Configuration

### Adjusting Security Parameters

To modify the security settings, edit [AuthContext.jsx](client/src/context/AuthContext.jsx):

```javascript
// In recordFailedAttempt function:

if (attempts >= 3) {  // Change threshold
  const lockoutUntil = Date.now() + (15 * 60 * 1000); // Change duration
  // ...
} else if (attempts === 2) {
  await new Promise(resolve => setTimeout(resolve, 5000)); // Change delay
  // ...
} else {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Change delay (1st attempt)
  // ...
}
```

### Recommended Values

- **Development**: Lower thresholds for testing (2 attempts, 2-minute lockout)
- **Production**: Current values (3 attempts, 15-minute lockout)
- **Higher Security**: Stricter limits (2 attempts, 30-minute lockout, CAPTCHA after 1 attempt)
- **More Lenient**: Relaxed limits (5 attempts, 10-minute lockout)

## Maintenance

### Clearing Lockouts (Admin)

If a legitimate user is locked out and needs immediate access, unlock them from the database:

**Method 1: Using Supabase SQL Editor**
```sql
-- Unlock specific account
UPDATE login_attempts
SET attempt_count = 0,
    locked_until = NULL
WHERE email = 'user@example.com';
```

**Method 2: Using Supabase Table Editor**
1. Go to Supabase Dashboard → Table Editor
2. Select `login_attempts` table
3. Find the user's row
4. Set `attempt_count` to `0` and `locked_until` to `NULL`
5. Save

**Method 3: Programmatically (if building admin panel)**
```javascript
import { unlockAccount } from './services/supabaseService';
await unlockAccount('user@example.com');
```

**See [ADMIN_UNLOCK_GUIDE.md](ADMIN_UNLOCK_GUIDE.md) for complete database management guide.**

### Monitoring

Consider implementing these monitoring practices:

1. **Track lockout frequency**: If many users hit lockouts (3 attempts), password policy may be too complex or users need training
2. **Monitor failed attempt patterns**: Sudden spikes could indicate attack attempts
3. **User feedback**: Collect feedback on whether the 3-attempt threshold and 15-minute lockout duration are appropriate

## Current Implementation Status

✅ **Implemented**:
- Database-based lockout tracking (Supabase `login_attempts` table)
- Cross-device enforcement
- Admin unlock capabilities via database
- Audit trail of failed login attempts
- Progressive delays (2s, 5s)
- 3-attempt threshold with 15-minute lockout
- Real-time countdown timers
- Visual security warnings

## Future Enhancements

Potential improvements to consider:

1. **IP-Based Limits**: Block IPs with excessive failed attempts across multiple accounts
2. **Geolocation Checks**: Alert on login attempts from unusual locations
3. **Device Fingerprinting**: Recognize trusted devices
4. **Risk-Based Authentication**: Adjust security based on context (time, location, device)
5. **Passwordless Authentication**: Magic links or WebAuthn for enhanced security
6. **Admin Dashboard**: Web UI for viewing/managing lockouts (currently SQL-based)
7. **Email Notifications**: Alert users of failed login attempts on their account
8. **CAPTCHA**: Add CAPTCHA after first or second failed attempt

---

**Last Updated**: January 2026
**Version**: 1.0
**Maintained By**: CK Forest Garden Development Team
