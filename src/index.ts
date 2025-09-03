import app from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Google Reviews API v2.0.0 started successfully!`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/swagger`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
  console.log(`ℹ️  API Info: http://localhost:${PORT}/info`);
  console.log(`📱 Sample endpoint: http://localhost:${PORT}/app?appid=com.whatsapp&lang=en`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
