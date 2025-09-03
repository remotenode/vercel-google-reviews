import { Request, Response } from 'express';
import { googlePlayService } from '../services/googlePlayService';
import { buildReviewOptions, validateReviewOptions } from '../utils';
import { startPerformanceMeasurement, endPerformanceMeasurement, formatPerformanceMetrics } from '../utils';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';
import { ReviewResponse, ApiResponse } from '../types';

/**
 * Controller for handling review-related API endpoints
 */
export class ReviewsController {
  /**
   * Get reviews for a specific app
   */
  async getReviews(req: Request, res: Response): Promise<void> {
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
      console.error('Error in getReviews:', error);
      
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
   * Get app information
   */
  async getAppInfo(req: Request, res: Response): Promise<void> {
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
      console.error('Error in getAppInfo:', error);
      
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
   * Search for apps
   */
  async searchApps(req: Request, res: Response): Promise<void> {
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
      console.error('Error in searchApps:', error);
      
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
   * Get app suggestions
   */
  async getAppSuggestions(req: Request, res: Response): Promise<void> {
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
      console.error('Error in getAppSuggestions:', error);
      
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Failed to get app suggestions',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      };
      
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
  }
}

// Export singleton instance
export const reviewsController = new ReviewsController();
