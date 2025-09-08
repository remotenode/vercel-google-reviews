import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel serverless function handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`🔍 Request received - URL: ${req.url}, method: ${req.method}`);

  let pathname = '/';
  
  try {
    // Simple pathname extraction
    if (req.url && req.url.startsWith('/')) {
      const extractedPath = req.url.split('?')[0];
      if (extractedPath) {
        pathname = extractedPath;
      }
    }

    console.log(`🎯 Final pathname: ${pathname}`);

    // Handle different routes
    switch (pathname) {
      case '/':
      case '/app':
        console.log('📱 Handling reviews request');
        return handleReviews(req, res);

      case '/health':
        console.log('🏥 Handling health check');
        return handleHealth(req, res);

      default:
        console.log(`❌ Unknown path: ${pathname}`);
        return handleNotFound(req, res);
    }
  } catch (error) {
    console.error('💥 Unhandled error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      statusCode: 500,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Handle reviews request - with correct library import pattern and date filtering
 */
async function handleReviews(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const { appid, country, lang, date } = req.query;
    console.log(`🔍 Reviews request - appid: ${appid}, country: ${country}, lang: ${lang}, date: ${date}`);

    // Validate required parameters
    if (!appid) {
      console.log('❌ Missing appid parameter');
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: appid',
        statusCode: 400,
        timestamp: new Date().toISOString(),
      });
    }

    if (!country) {
      console.log('❌ Missing country parameter');
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: country',
        statusCode: 400,
        timestamp: new Date().toISOString(),
      });
    }

    // Set parameter values (no defaults)
    const targetCountry = Array.isArray(country) ? country[0] : country;
    const targetLanguage = Array.isArray(lang) ? lang[0] : lang;
    const targetDate = (Array.isArray(date) ? date[0] : date);

    // Country-specific language mapping (10 most likely languages per country)
    const countryLanguageMap: { [key: string]: string[] } = {
      // Major countries with their most likely languages
      'US': ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
      'CA': ['en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
      'MX': ['es', 'en', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
      'BR': ['pt', 'es', 'en', 'fr', 'de', 'it', 'ru', 'ja', 'ko', 'zh'],
      'AR': ['es', 'en', 'pt', 'fr', 'de', 'it', 'ru', 'ja', 'ko', 'zh'],
      'GB': ['en', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
      'DE': ['de', 'en', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
      'FR': ['fr', 'en', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
      'ES': ['es', 'en', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
      'IT': ['it', 'en', 'fr', 'de', 'es', 'pt', 'ru', 'ja', 'ko', 'zh'],
      'PT': ['pt', 'en', 'es', 'fr', 'de', 'it', 'ru', 'ja', 'ko', 'zh'],
      'NL': ['nl', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
      'CN': ['zh', 'en', 'ja', 'ko', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
      'JP': ['ja', 'en', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
      'KR': ['ko', 'en', 'ja', 'zh', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
      'IN': ['hi', 'en', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa'],
      'ID': ['id', 'en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
      'TH': ['th', 'en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
      'VN': ['vi', 'en', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
      'PH': ['tl', 'en', 'es', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'it'],
      'MY': ['ms', 'en', 'zh', 'ta', 'ja', 'ko', 'ru', 'fr', 'de', 'es'],
      'SG': ['en', 'zh', 'ms', 'ta', 'ja', 'ko', 'ru', 'fr', 'de', 'es'],
      'TW': ['zh', 'en', 'ja', 'ko', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
      'HK': ['zh', 'en', 'ja', 'ko', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
      'AU': ['en', 'zh', 'ja', 'ko', 'ru', 'fr', 'de', 'es', 'it', 'pt'],
      'NZ': ['en', 'mi', 'ja', 'ko', 'zh', 'ru', 'fr', 'de', 'es', 'it'],
      'ZA': ['en', 'af', 'zu', 'xh', 'ja', 'ko', 'zh', 'ru', 'fr', 'de'],
      'NG': ['en', 'ha', 'yo', 'ig', 'ja', 'ko', 'zh', 'ru', 'fr', 'de'],
      'EG': ['ar', 'en', 'fr', 'ja', 'ko', 'zh', 'ru', 'de', 'es', 'it'],
      'TR': ['tr', 'en', 'ku', 'ar', 'ru', 'ja', 'ko', 'zh', 'fr', 'de'],
      'RU': ['ru', 'en', 'ja', 'ko', 'zh', 'fr', 'de', 'es', 'it', 'pt'],
      'PL': ['pl', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
      'SE': ['sv', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
      'NO': ['no', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
      'DK': ['da', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko'],
      'FI': ['fi', 'en', 'sv', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja'],
      'DEFAULT': ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh']
    };
    
    const supportedLanguages = countryLanguageMap[targetCountry!.toUpperCase()] || countryLanguageMap['DEFAULT'];
    
    // Ensure supportedLanguages is defined
    if (!supportedLanguages) {
      throw new Error('Failed to get supported languages for country');
    }

    console.log(`🎯 Target - country: ${targetCountry}, language: ${targetLanguage || 'ALL'}, date: ${targetDate}`);
    console.log(`🌍 Country-specific languages: ${supportedLanguages.join(', ')}`);

    // Fetch real reviews from Google Play Store - with correct import pattern
    console.log(`🚀 Fetching reviews for app: ${appid}, country: ${targetCountry}, lang: ${targetLanguage || 'COUNTRY-SPECIFIC LANGUAGES'}`);

    try {
      console.log('📦 Importing google-play-scraper...');
      const gplay = await import('google-play-scraper');
      console.log('✅ Library imported successfully');
      console.log('🔍 gplay object keys:', Object.keys(gplay));
      console.log('🔍 gplay type:', typeof gplay);
      
      // Try to find the reviews method - use the same logic as the working test
      let reviewsMethod: any = null;
      if (gplay.reviews) {
        reviewsMethod = gplay.reviews;
        console.log('📡 Using gplay.reviews directly');
      } else if ((gplay as any).default && (gplay as any).default.reviews) {
        reviewsMethod = (gplay as any).default.reviews;
        console.log('📡 Using gplay.default.reviews');
      } else if ((gplay as any).default && typeof (gplay as any).default === 'function') {
        reviewsMethod = (gplay as any).default;
        console.log('📡 Using gplay.default as function');
      } else {
        throw new Error('No reviews method found in any expected location');
      }
      
      let allReviews: any[] = [];
      
      if (targetLanguage) {
        // Fetch reviews for specific language
        console.log(`📡 Calling reviews method for language: ${targetLanguage}...`);
        const result = await reviewsMethod({
          appId: appid as string,
          num: 500,
          country: targetCountry,
          lang: targetLanguage
        });
        
        if (result?.data && Array.isArray(result.data)) {
          allReviews = result.data;
          console.log(`✅ Successfully fetched ${allReviews.length} reviews for language: ${targetLanguage}`);
        }
      } else {
        // Fetch reviews for all supported languages
        console.log(`📡 Fetching reviews for all ${supportedLanguages.length} supported languages...`);
        
        for (const language of supportedLanguages) {
          try {
            console.log(`📡 Fetching reviews for language: ${language}...`);
            const result = await reviewsMethod({
              appId: appid as string,
              num: 500,
              country: targetCountry,
              lang: language
            });
            
            if (result?.data && Array.isArray(result.data)) {
              allReviews = allReviews.concat(result.data);
              console.log(`✅ Fetched ${result.data.length} reviews for language: ${language}`);
            }
          } catch (langError) {
            console.log(`⚠️ Failed to fetch reviews for language ${language}:`, langError);
            // Continue with other languages
          }
        }
        
        console.log(`✅ Total reviews fetched from all languages: ${allReviews.length}`);
      }
      
      if (allReviews.length > 0) {
        console.log(`✅ Successfully fetched ${allReviews.length} reviews`);
        
        // Transform reviews to our API format with enhanced data extraction
        let transformedReviews = allReviews.map((review: any, index: number) => {
          // Try to get real review ID first, fallback to generated ID
          const realReviewId = review.reviewId || review.id;
          const uniqueId = realReviewId || `gp-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          // Construct Google Play Store URL with real review ID when available
          const url = `https://play.google.com/store/apps/details?id=${appid}&reviewId=${realReviewId || uniqueId}`;
          
          // Enhanced data extraction with fallbacks
          const extractedReview = {
            id: uniqueId,
            userName: review.userName || review.author || 'Anonymous User',
            userImage: review.userImage || review.profileImage || null, // Try to get real user image
            date: review.date || review.time || review.timestamp || new Date().toISOString(),
            score: review.score || review.rating || review.stars || 3,
            scoreText: String(review.score || review.rating || review.stars || 3),
            url: url,
            title: review.title || review.headline || null, // Try to get real title
            text: review.text || review.body || review.content || review.comment || 'No review text available',
            replyDate: review.replyDate || review.reply?.date || review.replyDate || null, // Try to get reply date
            replyText: review.replyText || review.reply?.text || review.replyText || null, // Try to get reply text
            version: review.appVersion || review.version || review.app_version || 'Unknown', // Better version detection
            thumbsUp: review.thumbsUp || null, // Individual thumbsUp field
            likes: review.likes || null, // Individual likes field
            helpful: review.helpful || null, // Individual helpful field
            positive: review.positive || null, // Individual positive field
            thumbsDown: review.thumbsDown || null, // Individual thumbsDown field
            dislikes: review.dislikes || null, // Individual dislikes field
            unhelpful: review.unhelpful || null, // Individual unhelpful field
            negative: review.negative || null, // Individual negative field
            criterias: review.criterias || review.criteria || review.tags || [] // Try to get criteria/tags if available
          };
          
          // Clean and validate the extracted data
          return cleanReviewData(extractedReview);
        });
        
        // Log enhanced data extraction summary
        const enhancedDataSummary = {
          totalReviews: transformedReviews.length,
          withRealIds: transformedReviews.filter((r: any) => !r.id.startsWith('gp-')).length,
          withUserImages: transformedReviews.filter((r: any) => r.userImage !== null).length,
          withTitles: transformedReviews.filter((r: any) => r.title !== null).length,
          withReplyData: transformedReviews.filter((r: any) => r.replyDate !== null || r.replyText !== null).length,
          withThumbsUp: transformedReviews.filter((r: any) => r.thumbsUp !== null).length,
          withLikes: transformedReviews.filter((r: any) => r.likes !== null).length,
          withHelpful: transformedReviews.filter((r: any) => r.helpful !== null).length,
          withPositive: transformedReviews.filter((r: any) => r.positive !== null).length,
          withThumbsDown: transformedReviews.filter((r: any) => r.thumbsDown !== null).length,
          withDislikes: transformedReviews.filter((r: any) => r.dislikes !== null).length,
          withUnhelpful: transformedReviews.filter((r: any) => r.unhelpful !== null).length,
          withNegative: transformedReviews.filter((r: any) => r.negative !== null).length,
          withCriteria: transformedReviews.filter((r: any) => r.criterias.length > 0).length,
          withBetterVersions: transformedReviews.filter((r: any) => r.version !== 'Unknown').length
        };
        
        console.log('🔍 Enhanced data extraction summary:', enhancedDataSummary);
        
        // Apply date filtering if specified
        if (targetDate) {
          console.log(`📅 Applying date filter: ${targetDate}`);
          const filterDate = parseDateFilter(targetDate);
          if (filterDate) {
            const originalCount = transformedReviews.length;
            transformedReviews = transformedReviews.filter((review: any) => {
              const reviewDate = new Date(review.date);
              return reviewDate >= filterDate;
            });
            console.log(`📅 Date filter applied: ${originalCount} → ${transformedReviews.length} reviews`);
          }
        }
        
        console.log(`🎉 Returning ${transformedReviews.length} reviews wrapped in data array`);
        
        // Return reviews wrapped in data array for new format
        return res.status(200).json({
          data: transformedReviews
        });
        
      } else {
        console.log('❌ No reviews found in response');
        
        return res.status(404).json({
          success: false,
          error: 'No reviews found for this app',
          statusCode: 404,
          timestamp: new Date().toISOString(),
          details: 'The app may not have any reviews or the app ID may be incorrect.'
        });
      }

    } catch (fetchError) {
      console.error('💥 Error fetching reviews:', fetchError);

      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error occurred';
      
      return res.status(503).json({
        success: false,
        error: 'Unable to fetch reviews from Google Play Store at this time. Please try again later.',
        statusCode: 503,
        timestamp: new Date().toISOString(),
        details: `Error details: ${errorMessage}`,
      });
    }

  } catch (error) {
    console.error('💥 Error handling reviews request:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews',
      statusCode: 500,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Clean and validate extracted review data
 */
function cleanReviewData(review: any): any {
  // Clean and validate text fields
  const cleanText = (text: string | null): string | null => {
    if (!text || typeof text !== 'string') return null;
    const cleaned = text.trim();
    return cleaned.length > 0 ? cleaned : null;
  };

  // Clean and validate date fields
  const cleanDate = (date: string | null): string | null => {
    if (!date) return null;
    try {
      const parsed = new Date(date);
      return isNaN(parsed.getTime()) ? null : parsed.toISOString();
    } catch {
      return null;
    }
  };

  // Clean and validate numeric fields
  const cleanNumber = (num: any, min: number = 0, max: number = 5): number | null => {
    if (num === null || num === undefined) return null;
    const parsed = Number(num);
    return isNaN(parsed) ? null : Math.max(min, Math.min(max, parsed));
  };

  // Clean and validate array fields
  const cleanArray = (arr: any): string[] => {
    if (!Array.isArray(arr)) return [];
    return arr
      .filter(item => item && typeof item === 'string' && item.trim().length > 0)
      .map(item => item.trim());
  };

  return {
    ...review,
    text: cleanText(review.text),
    title: cleanText(review.title),
    replyText: cleanText(review.replyText),
    date: cleanDate(review.date),
    replyDate: cleanDate(review.replyDate),
    score: cleanNumber(review.score, 1, 5),
    thumbsUp: cleanNumber(review.thumbsUp, 0),
    likes: cleanNumber(review.likes, 0),
    helpful: cleanNumber(review.helpful, 0),
    positive: cleanNumber(review.positive, 0),
    thumbsDown: cleanNumber(review.thumbsDown, 0),
    dislikes: cleanNumber(review.dislikes, 0),
    unhelpful: cleanNumber(review.unhelpful, 0),
    negative: cleanNumber(review.negative, 0),
    criterias: cleanArray(review.criterias)
  };
}

/**
 * Parse date filter and return a Date object
 * Supports both absolute (YYYY-MM-DD) and relative (7d, 1w, 1m, 1y) formats
 */
function parseDateFilter(dateFilter: string): Date | null {
  try {
    // Check for relative date formats
    if (dateFilter.match(/^\d+[dwmy]$/)) {
      const value = parseInt(dateFilter.slice(0, -1));
      const unit = dateFilter.slice(-1);
      const now = new Date();
      
      switch (unit) {
        case 'd': // days
          return new Date(now.getTime() - (value * 24 * 60 * 60 * 1000));
        case 'w': // weeks
          return new Date(now.getTime() - (value * 7 * 24 * 60 * 60 * 1000));
        case 'm': // months (approximate)
          return new Date(now.getTime() - (value * 30 * 24 * 60 * 60 * 1000));
        case 'y': // years
          return new Date(now.getTime() - (value * 365 * 24 * 60 * 60 * 1000));
        default:
          return null;
      }
    }
    
    // Check for absolute date format (YYYY-MM-DD)
    if (dateFilter.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return new Date(dateFilter + 'T00:00:00.000Z');
    }
    
    // Try to parse as ISO date string
    const parsedDate = new Date(dateFilter);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
    
    console.log(`⚠️ Invalid date format: ${dateFilter}`);
    return null;
    
  } catch (error) {
    console.error('💥 Error parsing date filter:', error);
    return null;
  }
}

/**
 * Handle health check
 */
function handleHealth(req: VercelRequest, res: VercelResponse): void {
  console.log('🏥 Health check requested');
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '2.0.0'
  });
}

/**
 * Handle not found routes
 */
function handleNotFound(req: VercelRequest, res: VercelResponse): void {
  console.log(`❌ Route not found: ${req.url}`);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    statusCode: 404,
    timestamp: new Date().toISOString(),
  });
}
