# CK Forest Garden Booking System

A complete, production-ready booking system for CK Forest Garden built with React, Node.js, Express, PostgreSQL, and Prisma.

## Features

### User Features
- 🏠 Beautiful homepage with Hero, About, Activities, Pricing, and Gallery sections
- 📅 Online booking system with real-time price calculation
- 💰 Simple pricing: GYD 5,000 per adult per day (Children under 12 FREE)
- 📧 Email confirmations for customers
- 📄 Payment receipt upload (JPG/PNG/PDF, max 5MB)
- 🧾 Booking reference generation and receipt download

### Admin Features
- 🔐 Secure admin login with JWT authentication
- 📊 Dashboard with statistics (bookings, revenue, status breakdown)
- 📋 Bookings management with search, filters, and pagination
- 👁️ View detailed booking information
- ✅ Update booking status (pending → confirmed → completed)
- ❌ Cancel bookings with reason tracking
- 📥 View uploaded payment receipts

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router v6
- React Hook Form
- Zod (validation)
- Axios
- Lucide Icons
- React Hot Toast

### Backend
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Bcrypt (password hashing)
- Multer (file uploads)
- Nodemailer (email)
- Zod (validation)

## Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone the Repository
```bash
cd ck-forest-garden
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your configuration:
# - DATABASE_URL (PostgreSQL connection string)
# - JWT_SECRET (random secure string)
# - Email credentials (Gmail SMTP)
# - Admin credentials

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database (creates admin user and sample data)
npm run prisma:seed

# Start development server
npm run dev
```

Server will run on http://localhost:5000

### 3. Frontend Setup

```bash
# Navigate to client directory (from root)
cd client

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env if needed (default API_URL is http://localhost:5000/api)

# Start development server
npm run dev
```

Frontend will run on http://localhost:5173

## Default Admin Credentials

After seeding the database:
- **Email:** admin@ckforestgarden.com
- **Password:** Admin123!

**⚠️ IMPORTANT:** Change these credentials in production!

## Project Structure

```
ck-forest-garden/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/    # Reusable components
│   │   │   ├── home/      # Home page sections
│   │   │   ├── booking/   # Booking flow components
│   │   │   └── admin/     # Admin components
│   │   ├── context/       # React Context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service (Axios)
│   │   ├── utils/         # Helper functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
│
└── server/                # Backend Node.js app
    ├── src/
    │   ├── config/        # Database & email config
    │   ├── controllers/   # Request handlers
    │   ├── middleware/    # Auth, upload, validation
    │   ├── routes/        # API routes
    │   ├── services/      # Email service
    │   ├── utils/         # Helper functions
    │   ├── app.js         # Express app setup
    │   └── server.js      # Server entry point
    ├── prisma/
    │   ├── schema.prisma  # Database schema
    │   └── seed.js        # Database seeding
    └── package.json
```

## API Endpoints

### Public Routes
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:reference` - Get booking by reference
- `POST /api/bookings/:id/upload` - Upload payment receipt

### Admin Routes (Protected)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get current admin user
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/bookings` - Get all bookings (with filters)
- `GET /api/admin/bookings/:id` - Get single booking
- `PATCH /api/admin/bookings/:id` - Update booking status
- `DELETE /api/admin/bookings/:id` - Cancel booking

## Business Logic

### Pricing
- **Rate:** GYD 5,000 per adult per day
- **Children:** Under 12 years - **FREE**
- **Minimum:** 10 adults required per booking
- **Formula:** `totalAmount = numberOfAdults × 5,000 × numberOfDays`

### Booking Reference Format
`CK-{timestamp}-{random}`

Example: `CK-1699123456789-A3B4C5`

## Email Configuration

The system uses Nodemailer with Gmail SMTP. To set up:

1. Create a Gmail account or use existing
2. Enable 2-factor authentication
3. Generate an App Password:
   - Go to Google Account → Security
   - Select "2-Step Verification"
   - Scroll to "App passwords"
   - Generate password for "Mail"
4. Use the app password in `.env` file

## Database Schema

### Users Table
- Admin authentication
- Hashed passwords with bcrypt

### Bookings Table
- Customer information
- Booking details (dates, type, guests)
- Pricing calculation
- Payment receipt path
- Status tracking
- Cancellation reason

## Development Scripts

### Backend
```bash
npm run dev          # Start development server
npm start            # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Update `DATABASE_URL` with production database
4. Configure email credentials
5. Change admin password
6. Set `CLIENT_URL` to production frontend URL
7. Run migrations: `npm run prisma:migrate`
8. Start server: `npm start`

### Frontend
1. Update `VITE_API_URL` to production API URL
2. Build: `npm run build`
3. Deploy `dist/` folder to hosting service (Vercel, Netlify, etc.)

## Environment Variables

### Server (.env)
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/ck_forest_garden
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@ckforestgarden.com
ADMIN_PASSWORD=Admin123!
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Testing the Application

1. **Create a Booking:**
   - Visit http://localhost:5173
   - Click "Book Your Visit"
   - Fill in the form (min 10 adults)
   - Submit and receive booking confirmation

2. **Upload Payment Receipt:**
   - After booking, click "Upload Payment Receipt"
   - Upload JPG/PNG/PDF (max 5MB)
   - Receive confirmation email

3. **Admin Dashboard:**
   - Visit http://localhost:5173/admin/login
   - Login with admin credentials
   - View dashboard statistics
   - Manage bookings (search, filter, update status)

## Features Checklist

✅ User can create booking with validation
✅ Real-time price calculation (adults × 5,000 × days)
✅ Children under 12 shown as FREE
✅ Minimum 10 adults enforced
✅ File upload with type/size validation
✅ Email notifications sent
✅ Admin login with JWT
✅ Admin dashboard with statistics
✅ Bookings list with search and filters
✅ Pagination (10 per page)
✅ Admin can update booking status
✅ Fully responsive design
✅ No console errors

## Support

For issues or questions, contact: info@ckforestgarden.com

## License

ISC

---

**Built with ❤️ for CK Forest Garden**
