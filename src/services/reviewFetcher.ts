import { GooglePlayReview, ScraperOptions } from '../types/index.js';

export class ReviewFetcher {
  /**
   * Fetch reviews for multiple languages
   */
  static async fetchMultiLanguageReviews(
    gplay: any, 
    appId: string, 
    country: string
  ): Promise<GooglePlayReview[]> {
    const allReviews: GooglePlayReview[] = [];
    const supportedLanguages = [
      'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'th', 'vi'
    ];
    
    console.log(`Fetching up to 500 reviews for each of ${supportedLanguages.length} languages`);
    
    for (const lang of supportedLanguages) {
      try {
        const options: ScraperOptions = {
          appId,
          num: 500,
          country: country || 'US',
          lang
        };
        
        console.log(`Fetching up to 500 reviews for language: ${lang}`);
        const result = await (gplay as any).reviews(options);
        
        if (result?.data && Array.isArray(result.data)) {
          const langReviews = result.data.map((review: GooglePlayReview) => ({
            ...review,
            language: lang,
            reviewId: `${lang}-${review.reviewId || Math.random().toString(36).substr(2, 9)}`
          }));
          allReviews.push(...langReviews);
          console.log(`Added ${langReviews.length} reviews for ${lang}`);
        }
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (langError) {
        console.log(`Failed to fetch reviews for language ${lang}:`, langError);
        continue;
      }
    }
    
    return allReviews;
  }

  /**
   * Fetch reviews for a single language
   */
  static async fetchSingleLanguageReviews(
    gplay: any, 
    appId: string, 
    country: string, 
    language: string
  ): Promise<GooglePlayReview[]> {
    const options: ScraperOptions = {
      appId,
      num: 500,
      country: country || 'US',
      lang: language
    };
    
    console.log('Scraper options:', options);
    
    const result = await (gplay as any).reviews(options);
    
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid response from Google Play Store');
    }
    
    // Extract reviews from response
    let reviews: GooglePlayReview[] = [];
    
    if (result.data && Array.isArray(result.data)) {
      reviews = result.data;
    } else if (result.reviews && Array.isArray(result.reviews)) {
      reviews = result.reviews;
    } else if (result.results && Array.isArray(result.results)) {
      reviews = result.results;
    } else {
      // Try to find any array property that might contain reviews
      const keys = Object.keys(result);
      for (const key of keys) {
        const value = (result as any)[key];
        if (Array.isArray(value) && value.length > 0) {
          const firstItem = value[0];
          if (firstItem && (firstItem.text || firstItem.score || firstItem.userName || firstItem.body)) {
            reviews = value;
            console.log(`Found reviews in property '${key}': ${reviews.length} reviews`);
            break;
          }
        }
      }
    }
    
    if (reviews.length === 0) {
      throw new Error('No reviews found in response');
    }
    
    return reviews;
  }
}
