import dotenv from 'dotenv';
import createApp from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { verifyEmailConfig } from './config/email.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Ensure required directories exist
 */
const createRequiredDirectories = () => {
  const uploadDir = path.join(__dirname, '../uploads/receipts');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Upload directory created:', uploadDir);
  }
};

/**
 * Start the server
 */
const startServer = async () => {
  try {
    console.log('🚀 Starting CK Forest Garden API Server...');
    console.log(`📍 Environment: ${NODE_ENV}`);

    // Create required directories
    createRequiredDirectories();

    // Connect to database
    await connectDatabase();

    // Verify email configuration (non-blocking)
    // Temporarily disabled for development
    // await verifyEmailConfig();

    // Create Express app
    const app = createApp();

    // Start listening
    const server = app.listen(PORT, () => {
      console.log('');
      console.log('✨ ════════════════════════════════════════ ✨');
      console.log(`   🌿 CK Forest Garden API Server Running`);
      console.log(`   🔗 http://localhost:${PORT}`);
      console.log(`   📊 Health Check: http://localhost:${PORT}/health`);
      console.log('✨ ════════════════════════════════════════ ✨');
      console.log('');
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal) => {
      console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('🔒 HTTP server closed');

        await disconnectDatabase();

        console.log('👋 Graceful shutdown completed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('⚠️  Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
