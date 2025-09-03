import { Review, ReviewOptions, PerformanceMetrics } from '../types';
import { API_CONFIG } from '../constants';

/**
 * Calculate MD5 hash of data
 */
export function calculateHash(data: unknown): string {
  const crypto = require('crypto');
  return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
}

/**
 * Remove duplicate reviews based on ID
 */
export function removeDuplicateReviews(reviews: Review[]): Review[] {
  const seen = new Set<string>();
  return reviews.filter(review => {
    if (seen.has(review.id)) {
      return false;
    }
    seen.add(review.id);
    return true;
  });
}

/**
 * Sort reviews by date (newest first)
 */
export function sortReviewsByDate(reviews: Review[]): Review[] {
  return reviews.sort((a, b) => {
    const dateA = new Date(a.date || a.at || '');
    const dateB = new Date(b.date || b.at || '');
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Validate review options
 */
export function validateReviewOptions(options: Partial<ReviewOptions>): string[] {
  const errors: string[] = [];
  
  if (!options.appId) {
    errors.push('appId is required');
  }
  
  if (options.num && (options.num < 1 || options.num > 100)) {
    errors.push('num must be between 1 and 100');
  }
  
  return errors;
}

/**
 * Build review options object
 */
export function buildReviewOptions(
  appId: string,
  country?: string,
  lang?: string,
  num?: number
): ReviewOptions {
  const options: ReviewOptions = {
    appId,
    num: num || API_CONFIG.DEFAULT_REVIEW_COUNT,
    sort: API_CONFIG.DEFAULT_SORT,
  };
  
  if (country) options.country = country;
  if (lang) options.lang = lang;
  
  return options;
}

/**
 * Start performance measurement
 */
export function startPerformanceMeasurement(): PerformanceMetrics {
  return {
    startTime: Date.now(),
    endTime: 0,
    duration: 0,
    memoryUsage: process.memoryUsage(),
  };
}

/**
 * End performance measurement
 */
export function endPerformanceMeasurement(metrics: PerformanceMetrics): PerformanceMetrics {
  metrics.endTime = Date.now();
  metrics.duration = metrics.endTime - metrics.startTime;
  metrics.memoryUsage = process.memoryUsage();
  return metrics;
}

/**
 * Format performance metrics for logging
 */
export function formatPerformanceMetrics(metrics: PerformanceMetrics): string {
  return `Duration: ${metrics.duration}ms, Memory: ${Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024)}MB`;
}

/**
 * Delay execution for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delayMs = baseDelay * Math.pow(2, attempt);
      await delay(delayMs);
    }
  }
  
  throw lastError!;
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>\"'&]/g, '');
}

/**
 * Validate app ID format
 */
export function isValidAppId(appId: string): boolean {
  // Basic validation for Google Play Store app IDs
  return /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/.test(appId);
}

/**
 * Validate country code format
 */
export function isValidCountryCode(countryCode: string): boolean {
  return /^[a-z]{2}$/.test(countryCode.toLowerCase());
}

/**
 * Validate language code format
 */
export function isValidLanguageCode(languageCode: string): boolean {
  return /^[a-z]{2}$/.test(languageCode.toLowerCase());
}
