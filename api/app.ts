import { VercelRequest, VercelResponse } from '@vercel/node';
import { googlePlayService } from '../src/services/googlePlayService';
import { swaggerService } from '../src/services/swaggerService';
import { buildReviewOptions, validateReviewOptions } from '../src/utils';
import { startPerformanceMeasurement, endPerformanceMeasurement, formatPerformanceMetrics } from '../src/utils';
import { HTTP_STATUS, ERROR_MESSAGES } from '../src/constants';
import { ReviewResponse, ApiResponse } from '../src/types';

/**
 * Vercel serverless function handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { pathname } = new URL(req.url || '/', `http://${req.headers.host}`);
  
  try {
    // Handle different routes
    switch (pathname) {
      case '/swagger':
        return handleSwaggerUI(req, res);
      
      case '/swagger.json':
        return handleSwaggerSpec(req, res);
      
      case '/app':
        return handleGetReviews(req, res);
      
      case '/app/info':
        return handleGetAppInfo(req, res);
      
      case '/app/search':
        return handleSearchApps(req, res);
      
      case '/app/suggestions':
        return handleGetAppSuggestions(req, res);
      
      case '/health':
        return handleHealth(req, res);
      
      case '/info':
        return handleApiInfo(req, res);
      
      default:
        return handleNotFound(req, res);
    }
  } catch (error) {
    console.error('Unhandled error in serverless function:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Internal server error',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Handle Swagger UI request
 */
function handleSwaggerUI(req: VercelRequest, res: VercelResponse): void {
  try {
    const baseUrl = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
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
 * Handle OpenAPI specification request
 */
function handleSwaggerSpec(req: VercelRequest, res: VercelResponse): void {
  try {
    const baseUrl = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
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
 * Handle get reviews request
 */
async function handleGetReviews(req: VercelRequest, res: VercelResponse): Promise<void> {
  const metrics = startPerformanceMeasurement();
  
  try {
    const { appid, country, lang } = req.query;
    
    // Validate required parameters
    if (!appid || typeof appid !== 'string') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: ERROR_MESSAGES.MISSING_APP_ID,
        statusCode: HTTP_STATUS.BAD_REQUEST,
        timestamp: new Date().toISOString(),
      };
      
      res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse);
      return;
    }

    // Build and validate options
    const options = buildReviewOptions(appid, country as string, lang as string);
    const validationErrors = validateReviewOptions(options);
    
    if (validationErrors.length > 0) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: validationErrors.join(', '),
        statusCode: HTTP_STATUS.BAD_REQUEST,
        timestamp: new Date().toISOString(),
      };
      
      res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse);
      return;
    }

    // Fetch reviews
    const reviews = await googlePlayService.fetchReviews(options);
    
    // Prepare response
    const reviewResponse: ReviewResponse = {
      data: reviews,
    };

    const successResponse: ApiResponse<ReviewResponse> = {
      success: true,
      data: reviewResponse,
      statusCode: HTTP_STATUS.OK,
      timestamp: new Date().toISOString(),
    };

    // Log performance metrics
    endPerformanceMeasurement(metrics);
    console.log(`Reviews fetched successfully: ${formatPerformanceMetrics(metrics)}`);
    console.log(`App ID: ${appid}, Country: ${country || 'all'}, Language: ${lang || 'all'}, Reviews: ${reviews.length}`);

    res.status(HTTP_STATUS.OK).json(successResponse);
    
  } catch (error) {
    endPerformanceMeasurement(metrics);
    console.error('Error in handleGetReviews:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: ERROR_MESSAGES.FETCH_FAILED,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
    };
    
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}

/**
 * Handle get app info request
 */
async function handleGetAppInfo(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const { appid } = req.query;
    
    if (!appid || typeof appid !== 'string') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Missing required parameter: appid',
        statusCode: HTTP_STATUS.BAD_REQUEST,
        timestamp: new Date().toISOString(),
      };
      
      res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse);
      return;
    }

    const appInfo = await googlePlayService.fetchAppInfo(appid);
    
    const successResponse: ApiResponse<any> = {
      success: true,
      data: appInfo,
      statusCode: HTTP_STATUS.OK,
      timestamp: new Date().toISOString(),
    };

    res.status(HTTP_STATUS.OK).json(successResponse);
    
  } catch (error) {
    console.error('Error in handleGetAppInfo:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch app information',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
    };
    
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}

/**
 * Handle search apps request
 */
async function handleSearchApps(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const { q, limit } = req.query;
    
    if (!q || typeof q !== 'string') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Missing required parameter: q (search query)',
        statusCode: HTTP_STATUS.BAD_REQUEST,
        timestamp: new Date().toISOString(),
      };
      
      res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse);
      return;
    }

    const searchLimit = limit ? parseInt(limit as string, 10) : 20;
    const apps = await googlePlayService.searchApps(q, searchLimit);
    
    const successResponse: ApiResponse<any[]> = {
      success: true,
      data: apps,
      statusCode: HTTP_STATUS.OK,
      timestamp: new Date().toISOString(),
    };

    res.status(HTTP_STATUS.OK).json(successResponse);
    
  } catch (error) {
    console.error('Error in handleSearchApps:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Failed to search for apps',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
    };
    
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}

/**
 * Handle get app suggestions request
 */
async function handleGetAppSuggestions(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Missing required parameter: q (search query)',
        statusCode: HTTP_STATUS.BAD_REQUEST,
        timestamp: new Date().toISOString(),
      };
      
      res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse);
      return;
    }

    const suggestions = await googlePlayService.getAppSuggestions(q);
    
    const successResponse: ApiResponse<string[]> = {
      success: true,
      data: suggestions,
      statusCode: HTTP_STATUS.OK,
      timestamp: new Date().toISOString(),
    };

    res.status(HTTP_STATUS.OK).json(successResponse);
    
  } catch (error) {
    console.error('Error in handleGetAppSuggestions:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Failed to get app suggestions',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
    };
    
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}

/**
 * Handle health check request
 */
function handleHealth(req: VercelRequest, res: VercelResponse): void {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '2.0.0',
  };

  res.status(HTTP_STATUS.OK).json(healthStatus);
}

/**
 * Handle API info request
 */
function handleApiInfo(req: VercelRequest, res: VercelResponse): void {
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

/**
 * Handle not found requests
 */
function handleNotFound(req: VercelRequest, res: VercelResponse): void {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: ERROR_MESSAGES.ROUTE_NOT_FOUND,
    statusCode: HTTP_STATUS.NOT_FOUND,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method,
  });
}
