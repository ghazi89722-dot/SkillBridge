import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

export const createApp = (): Express => {
  const app = express();

app.set('trust proxy', 1);

  // Security headers
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Apply general rate limiting
  app.use(apiLimiter);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'SkillBridge Backend API',
    });
  });

  // Mount API routes under /api/v1
  app.use('/api/v1', routes);

  // 404 handler for undefined routes
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      data: null,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${req.originalUrl} not found`,
      },
    });
  });

  // Centralized error handler
  app.use(errorHandler);

  return app;
};
