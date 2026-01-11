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
| 1-2 | None | Immediate feedback with remaining attempts counter |
| 3-4 | 2 seconds | Warning message with attempts remaining |
| 5 | 5 seconds | Final warning (1 attempt remaining) |
| 6+ | 15 minutes lockout | Account temporarily locked |

### Why Progressive Delays?

1. **User Experience**: Legitimate users aren't penalized on first attempts
2. **Attack Mitigation**: Makes brute force attacks impractical (2-5 second delays multiply across attempts)
3. **Resource Protection**: Prevents rapid-fire authentication requests that could overwhelm the system

## Account Lockout Mechanism

### Lockout Parameters

- **Threshold**: 6 failed attempts
- **Lockout Duration**: 15 minutes
- **Scope**: Per email address (allows legitimate users with different emails)
- **Storage**: localStorage (client-side tracking)

### Security Rationale

**15-Minute Duration**:
- OWASP recommends 15-30 minutes for temporary lockouts
- Long enough to deter automated attacks
- Short enough not to frustrate legitimate users who forgot their password

**6-Attempt Threshold**:
- NIST suggests 3-10 attempts before lockout
- 6 attempts balances security with usability (accounts for typos, caps lock, etc.)

## Implementation Details

### Client-Side Tracking

```javascript
// localStorage keys per email:
login_attempts_{email}  // Count of failed attempts
login_lockout_{email}   // Timestamp when lockout expires
```

**Why Client-Side?**
- No server-side state management needed
- Works seamlessly with Supabase Auth
- Protects against client-side automated attacks
- Reduces server load from blocked attempts

**Limitations**:
- User can clear localStorage to bypass (but still rate-limited by Supabase)
- Per-device only (not cross-device)

**Note**: This client-side protection is the first line of defense. Supabase Auth provides additional server-side rate limiting.

### Security Features

1. **Automatic Cleanup**: Expired lockouts are automatically removed
2. **Real-time Countdown**: Users see exactly when they can retry
3. **Clear Feedback**: Error messages show remaining attempts
4. **Form Disabling**: Locked accounts cannot submit the form
5. **Visual Indicators**: Red alert box with countdown timer during lockout

## User Experience Features

### Visual Feedback

1. **Security Notice**: Blue info box explaining the 6-attempt policy
2. **Lockout Warning**: Red alert box when account is locked with countdown timer
3. **Attempt Counter**: Error messages show "X attempts remaining before lockout"
4. **Progressive Warnings**: Messages escalate in urgency as attempts increase

### Example User Flow

```
Attempt 1: ❌ "Invalid email or password. (5 attempts remaining before lockout)"
Attempt 2: ❌ "Invalid email or password. (4 attempts remaining before lockout)"
Attempt 3: ⏱️ 2-second delay → ❌ "Invalid credentials. Warning: Too many failed attempts. (3 attempts remaining)"
Attempt 4: ⏱️ 2-second delay → ❌ "Invalid credentials. Warning: Too many failed attempts. (2 attempts remaining)"
Attempt 5: ⏱️ 5-second delay → ❌ "Warning: Account will be locked after one more failed attempt. (1 attempt remaining)"
Attempt 6: 🔒 15-minute lockout → "Account temporarily locked. Please try again in 15 minutes."
```

## Code Architecture

### AuthContext.jsx

**Functions**:
- `checkLockout(email)`: Checks if account is locked and returns status
- `recordFailedAttempt(email)`: Increments attempts, implements delays, triggers lockout
- `clearFailedAttempts(email)`: Removes tracking data on successful login
- `login(email, password)`: Enhanced with rate limiting checks

### Login.jsx

**Features**:
- Real-time lockout status checking
- Countdown timer display
- Form field disabling during lockout
- Visual lockout warnings

## Testing the Implementation

### Manual Testing Steps

1. **Test Progressive Delays**:
   - Enter wrong password 5 times
   - Observe increasing delays and warning messages
   - Verify attempt counter decrements correctly

2. **Test Lockout**:
   - Enter wrong password 6 times
   - Verify account locks for 15 minutes
   - Verify countdown timer displays and updates
   - Verify form fields are disabled

3. **Test Lockout Expiry**:
   - Wait for lockout to expire (or set shorter duration for testing)
   - Verify form re-enables automatically
   - Verify attempt counter resets

4. **Test Successful Login**:
   - Make 3 failed attempts
   - Enter correct credentials
   - Verify attempt counter is cleared
   - Verify no delays on next login

### Testing Different Emails

The rate limiting is per-email, so you can test by:
```
test1@example.com → Lock it out (6 attempts)
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

if (attempts >= 6) {  // Change threshold
  const lockoutUntil = Date.now() + (15 * 60 * 1000); // Change duration
  // ...
} else if (attempts === 5) {
  await new Promise(resolve => setTimeout(resolve, 5000)); // Change delay
  // ...
} else if (attempts >= 3) {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Change delay
  // ...
}
```

### Recommended Values

- **Development**: Lower thresholds for testing (3 attempts, 2-minute lockout)
- **Production**: Current values (6 attempts, 15-minute lockout)
- **High Security**: Stricter limits (4 attempts, 30-minute lockout, CAPTCHA after 2 attempts)

## Maintenance

### Clearing Lockouts (Admin)

If a legitimate user is locked out and needs immediate access:

```javascript
// Open browser console and run:
const email = 'user@example.com';
localStorage.removeItem(`login_lockout_${email}`);
localStorage.removeItem(`login_attempts_${email}`);
// User can now try logging in again
```

### Monitoring

Consider implementing these monitoring practices:

1. **Track lockout frequency**: If many users hit lockouts, password policy may be too complex
2. **Monitor failed attempt patterns**: Sudden spikes could indicate attack attempts
3. **User feedback**: Collect feedback on whether lockout duration is appropriate

## Future Enhancements

Potential improvements to consider:

1. **Server-Side Enforcement**: Move tracking to Supabase database for cross-device protection
2. **IP-Based Limits**: Block IPs with excessive failed attempts
3. **Geolocation Checks**: Alert on login attempts from unusual locations
4. **Device Fingerprinting**: Recognize trusted devices
5. **Risk-Based Authentication**: Adjust security based on context (time, location, device)
6. **Passwordless Authentication**: Magic links or WebAuthn for enhanced security

---

**Last Updated**: January 2026
**Version**: 1.0
**Maintained By**: CK Forest Garden Development Team
