import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  calculateHash,
  removeDuplicateReviews,
  sortReviewsByDate,
  validateReviewOptions,
  buildReviewOptions,
  startPerformanceMeasurement,
  endPerformanceMeasurement,
  formatPerformanceMetrics,
  delay,
  retryWithBackoff,
  sanitizeString,
  isValidAppId,
  isValidCountryCode,
  isValidLanguageCode,
} from '../src/utils';
import { Review, ReviewOptions } from '../src/types';

describe('Utility Functions', () => {
  describe('calculateHash', () => {
    it('should generate consistent hash for same data', () => {
      const data = { test: 'value' };
      const hash1 = calculateHash(data);
      const hash2 = calculateHash(data);
      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different data', () => {
      const hash1 = calculateHash({ test: 'value1' });
      const hash2 = calculateHash({ test: 'value2' });
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('removeDuplicateReviews', () => {
    it('should remove duplicate reviews based on ID', () => {
      const reviews: Review[] = [
        { id: '1', userName: 'User1', userImage: 'img1', score: 5, date: '2024-01-01' },
        { id: '2', userName: 'User2', userImage: 'img2', score: 4, date: '2024-01-02' },
        { id: '1', userName: 'User1', userImage: 'img1', score: 5, date: '2024-01-01' },
      ];

      const result = removeDuplicateReviews(reviews);
      expect(result).toHaveLength(2);
      expect(result.map(r => r.id)).toEqual(['1', '2']);
    });

    it('should return empty array for empty input', () => {
      const result = removeDuplicateReviews([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('sortReviewsByDate', () => {
    it('should sort reviews by date (newest first)', () => {
      const reviews: Review[] = [
        { id: '1', userName: 'User1', userImage: 'img1', score: 5, date: '2024-01-01' },
        { id: '2', userName: 'User2', userImage: 'img2', score: 4, date: '2024-01-03' },
        { id: '3', userName: 'User3', userImage: 'img3', score: 3, date: '2024-01-02' },
      ];

      const result = sortReviewsByDate(reviews);
      expect(result[0]?.id).toBe('2'); // 2024-01-03
      expect(result[1]?.id).toBe('3'); // 2024-01-02
      expect(result[2]?.id).toBe('1'); // 2024-01-01
    });

    it('should handle reviews with at field', () => {
      const reviews: Review[] = [
        { id: '1', userName: 'User1', userImage: 'img1', score: 5, date: '2024-01-01', at: '2024-01-01T00:00:00Z' },
        { id: '2', userName: 'User2', userImage: 'img2', score: 4, date: '2024-01-03', at: '2024-01-03T00:00:00Z' },
      ];

      const result = sortReviewsByDate(reviews);
      expect(result[0]?.id).toBe('2');
      expect(result[1]?.id).toBe('1');
    });
  });

  describe('validateReviewOptions', () => {
    it('should return empty array for valid options', () => {
      const options: Partial<ReviewOptions> = {
        appId: 'com.test.app',
        num: 20,
      };

      const errors = validateReviewOptions(options);
      expect(errors).toHaveLength(0);
    });

    it('should return error for missing appId', () => {
      const options: Partial<ReviewOptions> = {
        num: 20,
      };

      const errors = validateReviewOptions(options);
      expect(errors).toContain('appId is required');
    });

    it('should return error for invalid num value', () => {
      const options: Partial<ReviewOptions> = {
        appId: 'com.test.app',
        num: 0,
      };

      const errors = validateReviewOptions(options);
      expect(errors).toContain('num must be between 1 and 100');
    });
  });

  describe('buildReviewOptions', () => {
    it('should build options with default values', () => {
      const result = buildReviewOptions('com.test.app');
      expect(result).toEqual({
        appId: 'com.test.app',
        num: 30,
        sort: 'NEWEST',
      });
    });

    it('should build options with custom values', () => {
      const result = buildReviewOptions('com.test.app', 'us', 'en', 50);
      expect(result).toEqual({
        appId: 'com.test.app',
        country: 'us',
        lang: 'en',
        num: 50,
        sort: 'NEWEST',
      });
    });
  });

  describe('Performance Measurement', () => {
    it('should start and end performance measurement', async () => {
      const startMetrics = startPerformanceMeasurement();
      await delay(10);
      const endMetrics = endPerformanceMeasurement(startMetrics);

      expect(endMetrics.startTime).toBe(startMetrics.startTime);
      expect(endMetrics.endTime).toBeGreaterThan(startMetrics.startTime);
      expect(endMetrics.duration).toBeGreaterThan(0);
    });

    it('should format performance metrics', () => {
      const metrics = {
        startTime: Date.now() - 100,
        endTime: Date.now(),
        duration: 100,
        memoryUsage: process.memoryUsage(),
      };

      const formatted = formatPerformanceMetrics(metrics);
      expect(formatted).toContain('Duration: 100ms');
      expect(formatted).toContain('Memory:');
    });
  });

  describe('delay', () => {
    it('should delay execution', async () => {
      const start = Date.now();
      await delay(50);
      const end = Date.now();
      
      expect(end - start).toBeGreaterThanOrEqual(40);
    });
  });

  describe('retryWithBackoff', () => {
    it('should retry failed operations', async () => {
      let attempts = 0;
      const operation = jest.fn().mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Temporary failure');
        }
        return 'success';
      });

      const result = await retryWithBackoff(operation, 3, 10);
      expect(result).toBe('success');
      expect(attempts).toBe(3);
    });

    it('should throw error after max retries', async () => {
      const operation = jest.fn().mockImplementation(() => {
        throw new Error('Permanent failure');
      });

      await expect(retryWithBackoff(operation, 2, 10)).rejects.toThrow('Permanent failure');
    });
  });

  describe('sanitizeString', () => {
    it('should sanitize HTML characters', () => {
      const input = '<script>alert("xss")</script>';
      const result = sanitizeString(input);
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).not.toContain('"');
    });

    it('should trim whitespace', () => {
      const input = '  test string  ';
      const result = sanitizeString(input);
      expect(result).toBe('test string');
    });
  });

  describe('Validation Functions', () => {
    it('should validate app ID format', () => {
      expect(isValidAppId('com.whatsapp')).toBe(true);
      expect(isValidAppId('com.test.app')).toBe(true);
      expect(isValidAppId('invalid')).toBe(false);
      expect(isValidAppId('123.app')).toBe(false);
    });

    it('should validate country code format', () => {
      expect(isValidCountryCode('us')).toBe(true);
      expect(isValidCountryCode('VN')).toBe(true);
      expect(isValidCountryCode('123')).toBe(false);
      expect(isValidCountryCode('abc')).toBe(false);
    });

    it('should validate language code format', () => {
      expect(isValidLanguageCode('en')).toBe(true);
      expect(isValidLanguageCode('VI')).toBe(true);
      expect(isValidLanguageCode('123')).toBe(false);
      expect(isValidLanguageCode('abc')).toBe(false);
    });
  });
});
