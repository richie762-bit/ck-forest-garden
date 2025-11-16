import express from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../config/database.js';

const router = express.Router();

/**
 * Setup route to create admin user
 * This is a temporary route to ensure admin user exists
 * Should be removed or protected in production
 */
router.post('/create-admin', async (req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ckforestgarden.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Upsert admin user (create or update if exists)
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

    res.status(200).json({
      status: 'success',
      message: 'Admin user created/updated successfully',
      data: {
        email: adminUser.email,
        name: adminUser.name,
      },
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create admin user',
      error: error.message,
    });
  }
});

export default router;
