import { VercelRequest, VercelResponse } from './types/vercel.js';
import { fetchReviews } from './services/reviewService.js';
import { 
  sendSuccessResponse, 
  sendErrorResponse, 
  sendHealthResponse, 
  sendNotFoundResponse 
} from './utils/responseUtils.js';

/**
 * Vercel serverless function handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle different routes
  const { pathname } = new URL(req.url || '', 'http://localhost');
  
  if (pathname === '/health') {
    return handleHealth(req, res);
  }
  
  if (pathname === '/' || pathname === '' || pathname === '/app') {
    return handleReviews(req, res);
  }
  
  return handleNotFound(req, res);
}

/**
 * Handle health check requests
 */
async function handleHealth(req: VercelRequest, res: VercelResponse) {
  console.log('🏥 Health check requested');
  return sendHealthResponse(res);
}

/**
 * Handle review requests
 */
async function handleReviews(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('📱 Reviews endpoint called');
    console.log('🔍 Request method:', req.method);
    console.log('🔍 Request URL:', req.url);
    console.log('🔍 Request query:', req.query);

    // Extract query parameters
    const appid = req.query?.appid;
    const country = req.query?.country;
    const lang = req.query?.lang;
    const date = req.query?.date;

    // Validate required parameters
    if (!appid) {
      console.log('❌ Missing appid parameter');
      return sendErrorResponse(res, 400, 'Missing required parameter: appid');
    }

    if (!country) {
      console.log('❌ Missing country parameter');
      return sendErrorResponse(res, 400, 'Missing required parameter: country');
    }

    // Set parameter values (no defaults)
    const targetCountry = Array.isArray(country) ? country[0] : country;
    const targetLanguage = Array.isArray(lang) ? lang[0] : lang;
    const targetDate = Array.isArray(date) ? date[0] : date;

    console.log(`🎯 Processing request - appid: ${appid}, country: ${targetCountry}, language: ${targetLanguage || 'ALL'}, date: ${targetDate || 'NONE'}`);

    // Fetch reviews using the service
    const reviews = await fetchReviews(
      appid as string,
      targetCountry!,
      targetLanguage,
      targetDate
    );

    // Return success response (even with empty array)
    if (reviews.length > 0) {
      console.log(`✅ Successfully processed ${reviews.length} reviews`);
      return sendSuccessResponse(res, reviews, `Found ${reviews.length} reviews`);
    } else {
      console.log('⚠️ No reviews found - returning empty array');
      return sendSuccessResponse(res, [], 'No reviews found for this app'); // Force deployment
    }

  } catch (error) {
    console.error('💥 Error in handleReviews:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Country') && error.message.includes('not found')) {
        return sendErrorResponse(res, 400, error.message);
      }
      if (error.message.includes('Invalid date format')) {
        return sendErrorResponse(res, 400, error.message);
      }
    }
    
    return sendErrorResponse(res, 503, 'Failed to fetch reviews', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Handle not found routes
 */
function handleNotFound(req: VercelRequest, res: VercelResponse) {
  console.log('❌ Route not found:', req.url);
  return sendNotFoundResponse(res, `Route not found: ${req.url}`);
}