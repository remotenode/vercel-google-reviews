/**
 * Review fetching and transformation service - UPDATED
 */

import { getCountryLanguages } from '../config/countryLanguages.js';
import { parseDateFilter, filterReviewsByDate } from '../utils/dateUtils.js';
// Dynamic import for Vercel compatibility

/**
 * Clean and validate review data
 */
function cleanReviewData(review: any): any {
  return {
    id: review.id || null,
    userName: review.userName || 'Anonymous User',
    userImage: review.userImage || null,
    date: review.date || new Date().toISOString(),
    score: review.score || 3,
    scoreText: String(review.score || 3),
    url: review.url || null,
    title: review.title || null,
    text: review.text || 'No review text available',
    replyDate: review.replyDate || null,
    replyText: review.replyText || null,
    version: review.version || 'Unknown',
    thumbsUp: review.thumbsUp || 0,
    likes: review.likes || 0,
    helpful: review.helpful || 0,
    positive: review.positive || 0,
    thumbsDown: review.thumbsDown || 0,
    dislikes: review.dislikes || 0,
    unhelpful: review.unhelpful || 0,
    negative: review.negative || 0,
    criterias: review.criterias || [],
    // Additional requested fields (same data as existing fields)
    nickname: review.userName || 'Anonymous User',
    reviewDate: review.date || new Date().toISOString(),
    header: review.title || null,
    reviewRating: review.score || 3,
    reviewText: review.text || 'No review text available'
  };
}

/**
 * Transform reviews to our API format with enhanced data extraction
 */
function transformReviews(reviews: any[], appid: string): any[] {
  return reviews.map((review: any, index: number) => {
    // Try to get real review ID first, fallback to generated ID
    const realReviewId = review.reviewId || review.id;
    const uniqueId = realReviewId || `gp-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Construct Google Play Store URL with real review ID when available
    const url = `https://play.google.com/store/apps/details?id=${appid}&reviewId=${realReviewId || uniqueId}`;
    
    // Enhanced data extraction with fallbacks
    const extractedReview = {
      id: uniqueId,
      userName: review.userName || review.author || 'Anonymous User',
      userImage: review.userImage || review.profileImage || null,
      date: review.date || review.time || review.timestamp || new Date().toISOString(),
      score: review.score || review.rating || review.stars || 3,
      scoreText: String(review.score || review.rating || review.stars || 3),
      url: url,
      title: review.title || review.headline || null,
      text: review.text || review.body || review.content || review.comment || 'No review text available',
      replyDate: review.replyDate || review.reply?.date || review.replyDate || null,
      replyText: review.replyText || review.reply?.text || review.replyText || null,
      version: review.appVersion || review.version || review.app_version || 'Unknown',
      thumbsUp: review.thumbsUp || 0,
      likes: review.likes || 0,
      helpful: review.helpful || 0,
      positive: review.positive || 0,
      thumbsDown: review.thumbsDown || 0,
      dislikes: review.dislikes || 0,
      unhelpful: review.unhelpful || 0,
      negative: review.negative || 0,
      criterias: review.criterias || review.criteria || review.tags || []
    };
    
    return cleanReviewData(extractedReview);
  });
}

/**
 * Fetch reviews from Google Play Store
 */
export async function fetchReviews(
  appid: string,
  country: string,
  language?: string,
  dateFilter?: string
): Promise<any[]> {
  try {
    // Get country-specific languages
    const supportedLanguages = getCountryLanguages(country);
    
    console.log(`🎯 Target - country: ${country}, language: ${language || 'ALL'}, date: ${dateFilter}`);
    console.log(`🌍 Country-specific languages: ${supportedLanguages.join(', ')}`);

    // Import google-play-scraper dynamically
    console.log('📦 Importing google-play-scraper...');
    const gplay = await import('google-play-scraper');
    console.log('✅ Library imported successfully');
    
    const reviewsMethod = (gplay as any).default.reviews;
    let allReviews: any[] = [];

  try {
    if (language) {
      // Fetch reviews for specific language
      console.log(`📡 Calling reviews method for language: ${language}...`);
      const result = await reviewsMethod({
        appId: appid,
        num: 200,
        country: country,
        lang: language
      });
      
      if (result?.data && Array.isArray(result.data)) {
        allReviews = result.data;
        console.log(`✅ Successfully fetched ${allReviews.length} reviews for language: ${language}`);
      }
    } else {
      // Fetch reviews for all supported languages
      console.log(`📡 Fetching reviews for all ${supportedLanguages.length} supported languages...`);
      
      for (const lang of supportedLanguages) {
        try {
          console.log(`📡 Fetching reviews for language: ${lang}...`);
          const result = await reviewsMethod({
            appId: appid,
            num: 200,
            country: country,
            lang: lang
          });
          
          if (result?.data && Array.isArray(result.data)) {
            allReviews = allReviews.concat(result.data);
            console.log(`✅ Fetched ${result.data.length} reviews for language: ${lang}`);
          }
        } catch (langError) {
          console.log(`⚠️ Failed to fetch reviews for language ${lang}:`, langError);
          // Continue with other languages
        }
      }
      
      console.log(`✅ Total reviews fetched from all languages: ${allReviews.length}`);
    }
  } catch (error) {
    console.log(`⚠️ Failed to fetch reviews for app ${appid}:`, error);
    // Return empty array instead of throwing error
    return [];
  }

  // Transform reviews to our API format
  console.log('🔄 Transforming reviews...');
  let transformedReviews = transformReviews(allReviews, appid);
  console.log(`✅ Transformed ${transformedReviews.length} reviews`);

  // Apply date filtering if specified
  if (dateFilter) {
    try {
      const startDate = parseDateFilter(dateFilter);
      if (startDate) {
        console.log(`📅 Filtering reviews from ${startDate.toISOString()}...`);
        transformedReviews = filterReviewsByDate(transformedReviews, startDate);
        console.log(`✅ Filtered to ${transformedReviews.length} reviews after date filter`);
      }
    } catch (dateError) {
      console.log(`⚠️ Date filter error: ${dateError}`);
      throw dateError;
    }
  }

  return transformedReviews;
  } catch (error) {
    console.log(`⚠️ Failed to fetch reviews for app ${appid}:`, error);
    // Return empty array instead of throwing error
    return [];
  }
}