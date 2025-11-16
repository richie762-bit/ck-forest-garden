import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import setupRoutes from './routes/setupRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Create and configure Express application
 */
const createApp = () => {
  const app = express();

  // ===================================
  // Middleware Configuration
  // ===================================

  // CORS - Allow requests from frontend
  app.use(
    cors({
      origin: [
        process.env.CLIENT_URL || 'http://localhost:5173',
        'http://192.168.1.13:5173', // Allow local network access
      ],
      credentials: true,
    })
  );

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Serve static files (uploaded receipts)
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // ===================================
  // Routes
  // ===================================

  // Root endpoint - API info
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Welcome to CK Forest Garden API',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        bookings: '/api/bookings',
        admin: '/api/admin',
      },
      documentation: 'Visit /health for API status',
    });
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'CK Forest Garden API is running',
      timestamp: new Date().toISOString(),
    });
  });

  // API routes
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/setup', setupRoutes);

  // 404 handler for undefined routes
  app.use('*', (req, res) => {
    res.status(404).json({
      status: 'error',
      message: `Route ${req.originalUrl} not found`,
    });
  });

  // ===================================
  // Error Handler (must be last)
  // ===================================
  app.use(errorHandler);

  return app;
};

export default createApp;
