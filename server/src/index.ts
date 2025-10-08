import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import volunteerRoutes from './routes/volunteers';
import organizationRoutes from './routes/organizations';
import opportunityRoutes from './routes/opportunities';
import matchingRoutes from './routes/matches';

// Import services (commented out for now)
// import { UserService, VolunteerService, OrganizationService, CSROpportunityService, MatchingService } from './services';

// Import repositories (we'll implement these later)
// import { UserRepository, VolunteerRepository, OrganizationRepository, CSROpportunityRepository, MatchingRepository } from './repositories';

// Import DTOs
import { ApiResponseDTO } from './dto';

// Create Express application
const app: Application = express();

// Get port from environment or default to 5001
const PORT: number = parseInt(process.env['PORT'] || '5001', 10);

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const response: ApiResponseDTO = {
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env['NODE_ENV'] || 'development'
    },
    message: 'Server is running'
  };
  res.json(response);
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/matches', matchingRoutes);

// 404 handler
app.use('*', (_req: Request, res: Response) => {
  const response: ApiResponseDTO = {
    success: false,
    error: 'Route not found'
  };
  res.status(404).json(response);
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  
  const response: ApiResponseDTO = {
    success: false,
    error: process.env['NODE_ENV'] === 'production' ? 'Internal server error' : err.message
  };
  
  res.status(500).json(response);
});

// Database connection (optional for development)
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env['MONGODB_URI'];
    
    if (!mongoURI) {
      console.log('⚠️  No MongoDB URI provided, running without database');
      return;
    }

    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('⚠️  Continuing without database connection');
  }
};

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDB();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env['NODE_ENV'] || 'development'}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();

export default app;
