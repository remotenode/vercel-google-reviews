import { VercelRequest, VercelResponse } from '@vercel/node';
import { ReviewsRoutes } from './reviewsRoutes.js';
import { HealthRoutes } from './healthRoutes.js';

export class Routes {
  /**
   * Route request to appropriate handler
   */
  static async routeRequest(req: VercelRequest, res: VercelResponse): Promise<void> {
    const { pathname } = new URL(req.url || '/', `http://${req.headers.host}`);

    try {
      switch (pathname) {
        case '/':
        case '/app':
          return ReviewsRoutes.handleReviews(req, res);

        case '/health':
          return HealthRoutes.handleHealth(req, res);

        default:
          return this.handleNotFound(req, res);
      }
    } catch (error) {
      console.error('Unhandled error in routing:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Handle not found routes
   */
  private static handleNotFound(req: VercelRequest, res: VercelResponse): void {
    res.status(404).json({
      success: false,
      error: 'Route not found',
      statusCode: 404,
      timestamp: new Date().toISOString(),
    });
  }
}
