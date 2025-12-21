# Security Policy

## Reporting Security Issues

If you discover a security vulnerability in CK Forest Gardens, please email us at security@ckforestgarden.com.

**Please do not open public issues for security vulnerabilities.**

## Environment Variables

This project uses environment variables to store sensitive configuration. **Never commit `.env` files to version control.**

### Required Environment Variables

#### Client (Vite/React)
Create a `client/.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Where to get these values:**
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the Project URL and anon/public key

### Deployment Security

#### Vercel Environment Variables
Set these in your Vercel project dashboard (Settings → Environment Variables):

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

**Never store these in your code or commit them to Git.**

## Supabase Security

### Row Level Security (RLS)

All database tables use Row Level Security policies:

- **packages table**:
  - Public can SELECT active packages
  - Only authenticated users (admin) can INSERT, UPDATE, DELETE

- **package-images storage**:
  - Public read access for package images
  - Only authenticated users can upload/delete

### Admin Authentication

- Admin users are managed through Supabase Auth
- Email/password authentication is enabled
- Create admin users directly in Supabase dashboard

## Best Practices

1. **Never commit sensitive data**
   - No API keys, passwords, or secrets in code
   - Use `.env` files (which are gitignored)
   - Set environment variables in deployment platforms

2. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

3. **Use HTTPS only**
   - All API calls use HTTPS
   - Supabase enforces HTTPS

4. **Validate user input**
   - All forms use validation (React Hook Form + Zod)
   - Supabase RLS prevents unauthorized data access

5. **Secure file uploads**
   - File size limits enforced
   - Only images allowed (validated client and server-side)
   - Stored in public Supabase storage bucket

## Deprecated/Legacy Code

The `/server` folder contains deprecated backend code that is **NOT used in production**:
- All functionality migrated to Supabase
- Kept only for reference
- Does not contain active credentials
- Will be removed in future cleanup

## Security Headers

Vercel automatically provides:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

## Contact

For security concerns: security@ckforestgarden.com
