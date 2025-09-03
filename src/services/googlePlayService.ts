import { Review, GooglePlayReview, ScraperOptions } from '../types/index.js';

export class GooglePlayService {
  private static readonly SUPPORTED_LANGUAGES = [
    'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'th', 'vi'
  ];

  /**
   * Fetch reviews from Google Play Store
   */
  static async fetchReviews(
    appId: string, 
    country: string, 
    language: string
  ): Promise<Review[]> {
    try {
      console.log(`🚀 GooglePlayService.fetchReviews called with: appId=${appId}, country=${country}, language=${language}`);
      
      // Dynamically import google-play-scraper - use the same pattern as the working test
      console.log('📦 Importing google-play-scraper...');
      const gplay = await import('google-play-scraper');
      console.log('✅ google-play-scraper imported successfully');
      console.log('🔍 gplay object keys:', Object.keys(gplay));
      console.log('🔍 gplay type:', typeof gplay);
      
      let allReviews: GooglePlayReview[] = [];
      
      // If no specific language is specified, fetch reviews for multiple languages
      if (!language || language === 'all') {
        console.log('🌍 Fetching reviews for multiple languages...');
        allReviews = await this.fetchMultiLanguageReviews(gplay, appId, country);
      } else {
        console.log(`🌍 Fetching reviews for single language: ${language}`);
        allReviews = await this.fetchSingleLanguageReviews(gplay, appId, country, language);
      }

      console.log(`📊 Total reviews fetched: ${allReviews.length}`);

      // Transform and return reviews
      const transformedReviews = this.transformReviews(allReviews, country, language, appId);
      console.log(`🔄 Transformed ${transformedReviews.length} reviews`);
      
      return transformedReviews;
      
    } catch (error) {
      console.error('💥 Error in GooglePlayService.fetchReviews:', error);
      console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('💥 Error message:', error instanceof Error ? error.message : 'No message');
      throw error;
    }
  }

  /**
   * Fetch reviews for multiple languages
   */
  private static async fetchMultiLanguageReviews(
    gplay: any, 
    appId: string, 
    country: string
  ): Promise<GooglePlayReview[]> {
    const allReviews: GooglePlayReview[] = [];
    
    console.log(`🌍 Starting multi-language fetch for ${this.SUPPORTED_LANGUAGES.length} languages`);
    
    for (const lang of this.SUPPORTED_LANGUAGES) {
      try {
        console.log(`🌍 Fetching for language: ${lang}`);
        const options: ScraperOptions = {
          appId,
          num: 500, // Always fetch up to 500 per language
          country: country || 'US',
          lang
        };
        
        console.log(`🔧 Scraper options for ${lang}:`, JSON.stringify(options));
        console.log(`📡 Calling gplay.reviews for ${lang}...`);
        
        // Use the exact same pattern as the working test endpoint
        const result = await gplay.reviews(options);
        
        console.log(`📊 Result for ${lang}:`, typeof result, result ? Object.keys(result) : 'null/undefined');
        
        if (result?.data && Array.isArray(result.data)) {
          const langReviews = result.data.map((review: GooglePlayReview) => ({
            ...review,
            language: lang,
            reviewId: `${lang}-${review.reviewId || review.id || Math.random().toString(36).substr(2, 9)}`
          }));
          allReviews.push(...langReviews);
          console.log(`✅ Added ${langReviews.length} reviews for ${lang}`);
        } else {
          console.log(`⚠️ No valid data for ${lang}, result:`, result);
        }
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (langError) {
        console.error(`💥 Failed to fetch reviews for language ${lang}:`, langError);
        console.error(`💥 Error stack for ${lang}:`, langError instanceof Error ? langError.stack : 'No stack trace');
        continue; // Continue with next language
      }
    }
    
    console.log(`📊 Total reviews from multi-language fetch: ${allReviews.length}`);
    return allReviews;
  }

  /**
   * Fetch reviews for a single language
   */
  private static async fetchSingleLanguageReviews(
    gplay: any, 
    appId: string, 
    country: string, 
    language: string
  ): Promise<GooglePlayReview[]> {
    console.log(`🌍 Starting single language fetch for: ${language}`);
    
    const options: ScraperOptions = {
      appId,
      num: 500, // Always fetch up to 500 for single language
      country: country || 'US',
      lang: language
    };
    
    console.log('🔧 Scraper options:', JSON.stringify(options));
    console.log('📡 Calling gplay.reviews...');
    
    // Use the exact same pattern as the working test endpoint
    const result = await gplay.reviews(options);
    
    console.log('📊 Result received:', typeof result, result ? Object.keys(result) : 'null/undefined');
    
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid response from Google Play Store');
    }
    
    // Extract reviews from response - use the correct structure
    let reviews: GooglePlayReview[] = [];
    
    if (result.data && Array.isArray(result.data)) {
      reviews = result.data;
      console.log(`✅ Found reviews in result.data: ${reviews.length}`);
    } else {
      console.log('❌ No reviews found in response');
      console.log('🔍 Full result object:', JSON.stringify(result, null, 2));
      throw new Error('No reviews found in response');
    }
    
    if (reviews.length === 0) {
      console.log('❌ No reviews found in response');
      console.log('🔍 Full result object:', JSON.stringify(result, null, 2));
      throw new Error('No reviews found in response');
    }
    
    console.log(`✅ Successfully extracted ${reviews.length} reviews`);
    return reviews;
  }

  /**
   * Transform Google Play reviews to our API format
   */
  private static transformReviews(
    reviews: GooglePlayReview[], 
    country: string, 
    language: string,
    appId: string
  ): Review[] {
    console.log(`🔄 Transforming ${reviews.length} reviews...`);
    
    const transformed = reviews.map((review, index) => {
      // Generate a simple unique ID (since we don't have UUID library)
      const uniqueId = `${review.reviewId || review.id || `gp-${index}`}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Construct Google Play Store URL
      const reviewId = review.reviewId || review.id || uniqueId;
      const url = `https://play.google.com/store/apps/details?id=${appId}&reviewId=${reviewId}`;
      
      return {
        id: uniqueId,
        userName: review.userName || review.author || 'Anonymous User',
        userImage: null, // Not available from Google Play Store
        date: review.date || review.time || new Date().toISOString(),
        score: review.score || review.rating || 3,
        scoreText: String(review.score || review.rating || 3),
        url: url,
        title: null, // Not available from Google Play Store
        text: review.text || review.body || 'No review text available',
        replyDate: null, // Not available from Google Play Store
        replyText: null, // Not available from Google Play Store
        version: review.appVersion || 'Unknown',
        thumbsUp: null, // Not available from Google Play Store
        criterias: [] // Empty array as not available
      };
    });
    
    console.log(`✅ Transformation complete: ${transformed.length} reviews`);
    return transformed;
  }
}
