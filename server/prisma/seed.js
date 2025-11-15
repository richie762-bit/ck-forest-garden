import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Get admin credentials from environment variables
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ckforestgarden.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

  // Hash the admin password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create admin user (upsert to avoid duplicates)
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      name: 'CK Forest Garden Admin',
      role: 'admin',
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'CK Forest Garden Admin',
      role: 'admin',
    },
  });

  console.log('✅ Admin user created:', {
    id: adminUser.id,
    email: adminUser.email,
    name: adminUser.name,
  });

  // Create sample bookings for testing
  const sampleBookings = [
    {
      bookingReference: `CK-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      customerName: 'John Smith',
      customerEmail: 'john.smith@example.com',
      customerPhone: '+592-123-4567',
      bookingType: 'Day Visit',
      numberOfAdults: 15,
      numberOfChildren: 3,
      dateFrom: new Date('2025-11-20'),
      dateTo: new Date('2025-11-21'),
      numberOfDays: 1,
      ratePerAdultPerDay: 5000,
      totalAmount: 75000, // 15 adults × 5000 × 1 day
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
    },
    {
      bookingReference: `CK-${Date.now() + 1000}-${Math.random().toString(36).substring(7)}`,
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.johnson@example.com',
      customerPhone: '+592-234-5678',
      bookingType: 'Weekend Camping',
      numberOfAdults: 12,
      numberOfChildren: 2,
      dateFrom: new Date('2025-11-25'),
      dateTo: new Date('2025-11-27'),
      numberOfDays: 2,
      ratePerAdultPerDay: 5000,
      totalAmount: 120000, // 12 adults × 5000 × 2 days
      bookingStatus: 'pending',
      paymentStatus: 'pending',
    },
    {
      bookingReference: `CK-${Date.now() + 2000}-${Math.random().toString(36).substring(7)}`,
      customerName: 'Michael Brown',
      customerEmail: 'michael.brown@example.com',
      customerPhone: '+592-345-6789',
      bookingType: 'Corporate Event',
      numberOfAdults: 25,
      numberOfChildren: 0,
      dateFrom: new Date('2025-12-05'),
      dateTo: new Date('2025-12-06'),
      numberOfDays: 1,
      ratePerAdultPerDay: 5000,
      totalAmount: 125000, // 25 adults × 5000 × 1 day
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
    },
  ];

  // Create sample bookings
  for (const booking of sampleBookings) {
    const createdBooking = await prisma.booking.upsert({
      where: { bookingReference: booking.bookingReference },
      update: booking,
      create: booking,
    });
    console.log('✅ Sample booking created:', createdBooking.bookingReference);
  }

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📝 Admin Login Credentials:');
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
