import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import database
import sequelize from './config/database';
import Contact from './models/Contact';

// Import routes
import authRoutes from './routes/auth';
import contactRoutes from './routes/contact';
import whatsappRoutes from './routes/whatsapp';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:8080',
  'http://172.16.0.2:8080',
  'https://adsiri.in',
  'https://www.adsiri.in',
  'https://adsiri.in',
];

// CORS configuration - Allow all origins in development
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Adsiri Simple Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Database initialization and server start
const startServer = async () => {
  try {
    // Test database connection
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection established successfully.');

      // Sync database models (create tables if they don't exist)
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized.');
    } catch (dbError: unknown) {
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error';
      console.warn('⚠️ Database connection failed, running without database:', errorMessage);
      console.log('📝 Some features may not work without database connection.');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Admin login: http://localhost:${PORT}/api/auth/login`);
      console.log(`📧 Contact form: http://localhost:${PORT}/api/contact`);
      console.log(`💬 WhatsApp Links: http://localhost:${PORT}/api/whatsapp`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app; 