# CK Forest Garden - Deployment Guide

Your code is ready to deploy! Follow these steps:

## Step 1: Push to GitHub

1. **Go to GitHub.com and create account** (if you don't have one)
   - Visit: https://github.com/signup

2. **Create a new repository**
   - Click the "+" icon → "New repository"
   - Repository name: `ck-forest-garden`
   - Make it **Public** (required for free hosting)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. **Push your code** (copy these commands from GitHub and run in terminal):
   ```bash
   cd "c:\Users\gorin\ck-forest-garden"
   git remote add origin https://github.com/richie762-bit/ck-forest-garden.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy Database (Railway)

1. **Go to Railway**: https://railway.app
2. **Sign up with GitHub** (click "Login with GitHub")
3. **Create new project** → "Provision PostgreSQL"
4. **Copy connection string**:
   - Click on the PostgreSQL service
   - Go to "Variables" tab
   - Copy the `DATABASE_URL` value
   - **SAVE THIS** - you'll need it later!

## Step 3: Deploy Backend (Railway)

1. **In Railway, click "New"** → "GitHub Repo"
2. **Select** `ck-forest-garden` repository
3. **Configure the service**:
   - Railway will auto-detect Node.js
   - Click on the service → "Settings"
   - **Root Directory**: Enter `server`
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npm start`

4. **Add Environment Variables**:
   - Go to "Variables" tab
   - Add these one by one:

   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=<paste the database URL from Step 2>
   JWT_SECRET=<generate a random secret - use: https://generate-secret.vercel.app/32>
   JWT_EXPIRE=7d
   ADMIN_EMAIL=admin@ckforestgarden.com
   ADMIN_PASSWORD=<choose a strong password>
   CLIENT_URL=https://your-site.vercel.app
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=<your-gmail@gmail.com>
   EMAIL_PASSWORD=<your-app-password>
   EMAIL_FROM=CK Forest Garden <noreply@ckforestgarden.com>
   ```

5. **Get your backend URL**:
   - Go to "Settings" → "Domains"
   - Railway gives you: `https://something.railway.app`
   - **SAVE THIS URL** - you'll need it!

6. **Trigger redeploy**:
   - Click "Deploy" → "Redeploy"

## Step 4: Get Gmail App Password (for emails)

1. **Enable 2-Factor Authentication** on your Gmail:
   - Go to: https://myaccount.google.com/security
   - Turn on "2-Step Verification"

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password
   - **Add this to Railway** as `EMAIL_PASSWORD` variable

## Step 5: Deploy Frontend (Vercel)

1. **Go to Vercel**: https://vercel.com
2. **Sign up with GitHub**
3. **Import project** → Select `ck-forest-garden`
4. **Configure**:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variable**:
   - Click "Environment Variables"
   - Name: `VITE_API_URL`
   - Value: `https://your-railway-backend.railway.app/api`
   - (Use the Railway URL from Step 3)

6. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Vercel gives you: `https://ck-forest-garden.vercel.app`

## Step 6: Final Configuration

1. **Update CLIENT_URL in Railway**:
   - Go back to Railway backend
   - Update `CLIENT_URL` variable to your Vercel URL
   - Redeploy

2. **Test your site**!
   - Visit your Vercel URL
   - Try making a booking
   - Login to admin panel: `/admin/login`
     - Email: admin@ckforestgarden.com
     - Password: (the one you set)

## Your Site is LIVE! 🎉

**Public URL**: `https://ck-forest-garden.vercel.app`
**Admin URL**: `https://ck-forest-garden.vercel.app/admin/login`

---

## Getting a Custom Domain (Optional)

Want `www.ckforestgarden.com` instead of `vercel.app`?

1. **Buy domain** from:
   - Namecheap: https://www.namecheap.com (~$10/year)
   - Google Domains: https://domains.google.com
   - GoDaddy: https://www.godaddy.com

2. **Add to Vercel**:
   - Vercel Dashboard → Your Project → "Settings" → "Domains"
   - Add your domain
   - Follow the instructions to update DNS

---

## Troubleshooting

**Backend not working?**
- Check Railway logs: Service → "Deployments" → Click on build
- Make sure all environment variables are set
- Ensure DATABASE_URL is correct

**Frontend not connecting to backend?**
- Check VITE_API_URL is correct
- Must end with `/api` (no trailing slash before /api)
- Example: `https://abc123.railway.app/api`

**Emails not sending?**
- Check Gmail App Password is correct
- Ensure 2FA is enabled on Gmail
- Check Railway logs for error messages

**Need help?**
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs

---

## Keeping Your Site Updated

Whenever you make changes:

```bash
cd "c:\Users\gorin\ck-forest-garden"
git add .
git commit -m "Description of changes"
git push
```

**Railway** and **Vercel** will automatically redeploy!
