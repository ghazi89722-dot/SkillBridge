import { createApp } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(env.PORT, () => {
      console.log(`
🚀 SkillBridge Backend API is running!
📡 Environment: ${env.NODE_ENV}
🚪 Port: ${env.PORT}
🌐 Base URL: http://localhost:${env.PORT}/api/v1
💚 Health Check: http://localhost:${env.PORT}/health
      `);
    });

    // Graceful shutdown handling
    const shutdown = () => {
      console.log('⚠️  Shutting down server gracefully...');
      server.close(() => {
        console.log('🛑 Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
