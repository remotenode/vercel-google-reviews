import { Request, Response } from 'express';
import { swaggerService } from '../services/swaggerService';
import { HTTP_STATUS } from '../constants';

/**
 * Controller for handling documentation-related endpoints
 */
export class DocumentationController {
  /**
   * Serve Swagger UI
   */
  getSwaggerUI(req: Request, res: Response): void {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const html = swaggerService.generateSwaggerUI(baseUrl);
      
      res.setHeader('Content-Type', 'text/html');
      res.status(HTTP_STATUS.OK).send(html);
    } catch (error) {
      console.error('Error generating Swagger UI:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to generate Swagger UI',
      });
    }
  }

  /**
   * Serve OpenAPI specification
   */
  getSwaggerSpec(req: Request, res: Response): void {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const spec = swaggerService.generateSwaggerSpec(baseUrl);
      
      res.setHeader('Content-Type', 'application/json');
      res.status(HTTP_STATUS.OK).json(spec);
    } catch (error) {
      console.error('Error generating Swagger spec:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to generate OpenAPI specification',
      });
    }
  }

  /**
   * Get API health status
   */
  getHealth(req: Request, res: Response): void {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '2.0.0',
    };

    res.status(HTTP_STATUS.OK).json(healthStatus);
  }

  /**
   * Get API information
   */
  getApiInfo(req: Request, res: Response): void {
    const apiInfo = {
      name: 'Google Reviews API',
      version: '2.0.0',
      description: 'API for fetching Google Play Store app reviews with multi-language support',
      endpoints: {
        '/app': 'Get app reviews',
        '/app/info': 'Get app information',
        '/app/search': 'Search for apps',
        '/app/suggestions': 'Get app suggestions',
        '/swagger': 'Interactive API documentation',
        '/swagger.json': 'OpenAPI specification',
        '/health': 'API health status',
        '/info': 'API information',
      },
      features: [
        'Multi-language support (100+ languages)',
        'Country-specific reviews',
        'Real-time Google Play Store data',
        'Comprehensive error handling',
        'Performance monitoring',
        'Rate limiting protection',
        'TypeScript implementation',
        'Modular architecture',
      ],
      contact: {
        name: 'API Support',
        url: 'https://github.com/remotenode/vercel-google-reviews',
      },
    };

    res.status(HTTP_STATUS.OK).json(apiInfo);
  }
}

// Export singleton instance
export const documentationController = new DocumentationController();
