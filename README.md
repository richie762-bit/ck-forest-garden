# CK Forest Gardens 🌳

A modern booking and package management system for CK Forest Gardens, Guyana's premier eco-tourism destination.

## Features

- 🎯 **Dynamic Package Management**: Create, edit, and manage packages through admin dashboard
- 📸 **Image Galleries**: Upload up to 5 images per package with carousel display
- 🔐 **Secure Admin Panel**: Supabase authentication with row-level security
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- ⚡ **Fast Performance**: Built with Vite and optimized for speed
- 🎨 **Modern UI**: Clean interface with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, Vite, React Router v6
- **Styling**: Tailwind CSS, Lucide Icons
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Deployment**: Vercel
- **Forms**: React Hook Form + Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ck-forest-garden.git
   cd ck-forest-garden
   ```

2. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Set up environment variables**

   Create `client/.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**

   Run the SQL schema in your Supabase project:
   ```bash
   # Find the schema in: supabase-packages-schema.sql
   ```

   Create the storage bucket:
   - Go to Supabase Dashboard → Storage
   - Create bucket: `package-images`
   - Make it public

5. **Run development server**
   ```bash
   npm run dev
   ```

   Visit http://localhost:5173

### Deployment

#### Deploy to Vercel

1. **Connect repository to Vercel**
   - Import your GitHub repository
   - Framework Preset: `Vite`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Set environment variables in Vercel**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. **Deploy!**
   - Vercel will auto-deploy on every push to `main`

## Project Structure

```
ck-forest-garden/
├── client/                  # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── admin/     # Admin dashboard components
│   │   │   ├── common/    # Shared components (Header, Footer)
│   │   │   └── home/      # Public-facing components
│   │   ├── context/       # React Context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services (Supabase)
│   │   └── utils/         # Helper functions
│   ├── public/            # Static assets
│   └── vercel.json        # Vercel configuration
├── server/                # DEPRECATED - Legacy backend (not used)
├── supabase-packages-schema.sql  # Database schema
└── SECURITY.md           # Security guidelines
```

## Admin Access

### Creating Admin Users

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → Create new user
3. Use this email/password to login at `/admin/login`

### Admin Features

- **Package Management**: Create, edit, delete, activate/deactivate packages
- **Image Upload**: Upload and manage package images
- **Preview**: See how packages appear to visitors

## Security

- Environment variables are never committed to Git
- Supabase Row Level Security (RLS) protects data
- Admin routes require authentication
- File upload validation and size limits
- See [SECURITY.md](SECURITY.md) for full details

## Environment Variables

See `client/.env.example` for required variables.

**Never commit `.env` files to version control!**

## Contributing

This is a private project for CK Forest Gardens. For authorized contributors:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Support

For support or inquiries:
- WhatsApp: +592 712-2534
- Email: info@ckforestgarden.com

## License

© 2025 CK Forest Gardens. All rights reserved.

---

**Built with ❤️ for CK Forest Gardens**
