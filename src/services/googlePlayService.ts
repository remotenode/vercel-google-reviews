import * as gplay from 'google-play-scraper';
import { Review, ReviewOptions } from '../types';
import { SUPPORTED_LANGUAGES, API_CONFIG } from '../constants';
import { removeDuplicateReviews, sortReviewsByDate, delay, retryWithBackoff } from '../utils';

/**
 * Service for interacting with Google Play Store
 */
export class GooglePlayService {
  /**
   * Convert Google Play scraper review to our Review type
   */
  private convertToReviewType(scraperReview: any): Review {
    return {
      id: scraperReview.id,
      userName: scraperReview.userName,
      userImage: scraperReview.userImage,
      content: scraperReview.text || scraperReview.content,
      text: scraperReview.text,
      score: scraperReview.score,
      thumbsUpCount: scraperReview.thumbsUp || scraperReview.thumbsUpCount,
      thumbsUp: scraperReview.thumbsUp,
      reviewCreatedVersion: scraperReview.reviewCreatedVersion || scraperReview.version,
      version: scraperReview.version,
      at: scraperReview.at || scraperReview.date,
      date: scraperReview.date,
      replyContent: scraperReview.replyContent,
      repliedAt: scraperReview.repliedAt || scraperReview.replyDate,
      replyDate: scraperReview.replyDate,
      replyText: scraperReview.replyText,
      scoreText: scraperReview.scoreText,
      url: scraperReview.url,
      title: scraperReview.title,
      criterias: scraperReview.criterias,
    };
  }

  /**
   * Fetch reviews for a specific app
   */
  async fetchReviews(options: ReviewOptions): Promise<Review[]> {
    try {
      // If specific language is requested, fetch only that language
      if (options.lang) {
        return await this.fetchReviewsForLanguage(options);
      }

      // Fetch reviews in all supported languages
      return await this.fetchReviewsInAllLanguages(options);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw new Error('Failed to fetch reviews from Google Play Store');
    }
  }

  /**
   * Fetch reviews for a specific language
   */
  private async fetchReviewsForLanguage(options: ReviewOptions): Promise<Review[]> {
    const reviewOptions: any = {
      num: options.num || API_CONFIG.DEFAULT_REVIEW_COUNT,
      sort: gplay.sort.NEWEST,
      appId: options.appId,
    };

    if (options.country) reviewOptions.country = options.country;
    if (options.lang) reviewOptions.lang = options.lang;

    try {
      const result = await retryWithBackoff(async () => {
        return await gplay.reviews(reviewOptions);
      });

      return (result.data || []).map(review => this.convertToReviewType(review));
    } catch (error) {
      console.error(`Error fetching reviews for language ${options.lang}:`, (error as Error).message);
      throw error;
    }
  }

  /**
   * Fetch reviews in all supported languages
   */
  private async fetchReviewsInAllLanguages(options: ReviewOptions): Promise<Review[]> {
    const baseOptions = {
      num: options.num || API_CONFIG.DEFAULT_REVIEW_COUNT,
      sort: gplay.sort.NEWEST,
      appId: options.appId,
      country: options.country,
    };

    // Create promises for all language requests
    const fetchPromises = SUPPORTED_LANGUAGES.map(async (language) => {
      const langOptions: any = { ...baseOptions, lang: language.code };
      
      try {
        const result = await retryWithBackoff(async () => {
          return await gplay.reviews(langOptions);
        });

        return (result.data || []).map(review => this.convertToReviewType(review));
      } catch (error) {
        console.error(`Error fetching reviews for ${language.code}:`, (error as Error).message);
        return [];
      }
    });

    try {
      // Execute all requests in parallel
      const results = await Promise.all(fetchPromises);
      
      // Flatten and process results
      let allReviews = results.flat();
      console.log(`Fetched ${allReviews.length} total reviews from all languages`);

      // Remove duplicates and sort
      allReviews = removeDuplicateReviews(allReviews);
      console.log(`After deduplication: ${allReviews.length} reviews`);

      allReviews = sortReviewsByDate(allReviews);
      console.log(`Final review count: ${allReviews.length}`);

      return allReviews;
    } catch (error) {
      console.error('Error during parallel fetching:', error);
      throw new Error('Failed to fetch reviews from multiple languages');
    }
  }

  /**
   * Fetch app information
   */
  async fetchAppInfo(appId: string): Promise<any> {
    try {
      return await retryWithBackoff(async () => {
        return await gplay.app({ appId });
      });
    } catch (error) {
      console.error(`Error fetching app info for ${appId}:`, error);
      throw new Error('Failed to fetch app information');
    }
  }

  /**
   * Search for apps
   */
  async searchApps(query: string, limit: number = 20): Promise<any[]> {
    try {
      return await retryWithBackoff(async () => {
        return await gplay.search({
          term: query,
          num: limit,
        });
      });
    } catch (error) {
      console.error(`Error searching for apps with query "${query}":`, error);
      throw new Error('Failed to search for apps');
    }
  }

  /**
   * Get app suggestions
   */
  async getAppSuggestions(query: string): Promise<string[]> {
    try {
      return await retryWithBackoff(async () => {
        return await gplay.suggest({ term: query });
      });
    } catch (error) {
      console.error(`Error getting suggestions for "${query}":`, error);
      throw new Error('Failed to get app suggestions');
    }
  }

  /**
   * Get app permissions
   */
  async getAppPermissions(appId: string): Promise<any> {
    try {
      return await retryWithBackoff(async () => {
        return await gplay.permissions({ appId });
      });
    } catch (error) {
      console.error(`Error fetching permissions for ${appId}:`, error);
      throw new Error('Failed to fetch app permissions');
    }
  }

  /**
   * Get app developer
   */
  async getAppDeveloper(developerId: string): Promise<any> {
    try {
      return await retryWithBackoff(async () => {
        return await gplay.developer({ devId: developerId });
      });
    } catch (error) {
      console.error(`Error fetching developer info for ${developerId}:`, error);
      throw new Error('Failed to fetch developer information');
    }
  }
}

// Export singleton instance
export const googlePlayService = new GooglePlayService();
