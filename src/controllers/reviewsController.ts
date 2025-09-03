import { VercelRequest, VercelResponse } from '@vercel/node';
import { GooglePlayService } from '../services/googlePlayService.js';
import { ApiResponse, Review } from '../types/index.js';

export class ReviewsController {
  /**
   * Handle get reviews request
   */
  static async getReviews(req: VercelRequest, res: VercelResponse): Promise<void> {
    try {
      const { appid, country, lang } = req.query;

      // Validate required parameters
      if (!appid) {
        const errorResponse: ApiResponse<null> = {
          success: false,
          error: 'Missing required parameter: appid',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        };
        return res.status(400).json(errorResponse);
      }

      // Set default values: always fetch up to 500 reviews per language
      const targetCountry = (Array.isArray(country) ? country[0] : country) || 'US';
      const targetLanguage = (Array.isArray(lang) ? lang[0] : lang) || 'all';

      // Fetch real reviews from Google Play Store
      console.log(`Fetching real reviews from Google Play Store for app: ${appid}, country: ${targetCountry}, lang: ${targetLanguage}`);

      try {
        const reviews = await GooglePlayService.fetchReviews(
          appid as string, 
          targetCountry, 
          targetLanguage
        );

        if (reviews.length === 0) {
          const errorResponse: ApiResponse<null> = {
            success: false,
            error: 'No reviews found for this app',
            statusCode: 404,
            timestamp: new Date().toISOString(),
            details: 'The app may not have any reviews or the app ID may be incorrect.'
          };
          return res.status(404).json(errorResponse);
        }

        console.log(`Successfully fetched ${reviews.length} real reviews from Google Play Store for ${appid}`);
        
        // Return reviews wrapped in data array for new format
        return res.status(200).json({
          data: reviews
        });

      } catch (fetchError) {
        console.error('Error fetching real reviews from Google Play Store:', fetchError);

        // Provide more detailed error information
        const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error occurred';
        
        const errorResponse: ApiResponse<null> = {
          success: false,
          error: 'Unable to fetch real reviews from Google Play Store at this time. Please try again later.',
          statusCode: 503,
          timestamp: new Date().toISOString(),
          details: `Error details: ${errorMessage}. This may be due to Vercel serverless limitations or Google Play Store restrictions.`,
          recommendation: 'Consider using a traditional server deployment for better compatibility with google-play-scraper.'
        };
        
        return res.status(503).json(errorResponse);
      }

    } catch (error) {
      console.error('Error handling reviews request:', error);
      
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch reviews',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      };
      
      return res.status(500).json(errorResponse);
    }
  }
}
