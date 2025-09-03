import express from 'express';
import routes from './routes';
import { HTTP_STATUS, ERROR_MESSAGES } from './constants';

/**
 * Main Express application
 */
export class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Initialize middleware
   */
  private initializeMiddleware(): void {
    // Body parser middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // CORS middleware
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });

    // Request logging middleware
    this.app.use((req, res, next) => {
      const start = Date.now();
      console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
      });
      
      next();
    });

    // Security middleware
    this.app.use((req, res, next) => {
      // Remove sensitive headers
      res.removeHeader('X-Powered-By');
      
      // Add security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      
      next();
    });
  }

  /**
   * Initialize routes
   */
  private initializeRoutes(): void {
    this.app.use('/', routes);
  }

  /**
   * Initialize error handling
   */
  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use((req, res) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: ERROR_MESSAGES.ROUTE_NOT_FOUND,
        statusCode: HTTP_STATUS.NOT_FOUND,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method,
      });
    });

    // Global error handler
    this.app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Global error handler:', error);
      
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Internal server error',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method,
      });
    });
  }

  /**
   * Start the server
   */
  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📚 API Documentation: http://localhost:${port}/swagger`);
      console.log(`🔍 Health Check: http://localhost:${port}/health`);
      console.log(`ℹ️  API Info: http://localhost:${port}/info`);
    });
  }
}

// Export the app instance
export default new App().app;
