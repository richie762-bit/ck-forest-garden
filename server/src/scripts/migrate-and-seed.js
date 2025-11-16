import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Run database migrations and seed
 * This script runs on server startup to ensure database is up to date
 */
const migrateAndSeed = async () => {
  try {
    console.log('🔄 Running database migrations...');

    // Run Prisma migrations
    const { stdout: migrateOutput, stderr: migrateError } = await execAsync('npx prisma migrate deploy');

    if (migrateError) {
      console.warn('⚠️  Migration warnings:', migrateError);
    }
    console.log('✅ Migrations completed');
    console.log(migrateOutput);

    // Check if database needs seeding
    console.log('🌱 Checking if database needs seeding...');

    // Run seed script
    const { stdout: seedOutput, stderr: seedError } = await execAsync('npx prisma db seed');

    if (seedError && !seedError.includes('already exists')) {
      console.warn('⚠️  Seed warnings:', seedError);
    }
    console.log('✅ Database seeded');
    console.log(seedOutput);

  } catch (error) {
    // Check if error is because admin already exists
    if (error.message.includes('Unique constraint') || error.message.includes('already exists')) {
      console.log('ℹ️  Database already seeded, skipping...');
    } else {
      console.error('❌ Migration/Seed error:', error.message);
      // Don't exit the process, just log the error
      // The server can still start even if migration fails
    }
  }
};

export default migrateAndSeed;
