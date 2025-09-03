import { Review, GooglePlayReview } from '../types/index.js';

export class ReviewTransformer {
  /**
   * Transform Google Play reviews to our API format
   */
  static transformReviews(
    reviews: GooglePlayReview[], 
    country: string, 
    language: string,
    appId: string
  ): Review[] {
    return reviews.map((review, index) => {
      // Generate a simple unique ID
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
  }
}
