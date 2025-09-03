import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GooglePlayService } from '../src/services/googlePlayService';
import { SwaggerService } from '../src/services/swaggerService';
import { Review, ReviewOptions } from '../src/types';

// Mock google-play-scraper
jest.mock('google-play-scraper', () => ({
  reviews: jest.fn(),
  app: jest.fn(),
  search: jest.fn(),
  suggest: jest.fn(),
  permissions: jest.fn(),
  developer: jest.fn(),
  sort: {
    NEWEST: 'NEWEST',
  },
}));

describe('Services', () => {
  describe('GooglePlayService', () => {
    let service: GooglePlayService;
    const mockGplay = require('google-play-scraper');

    beforeEach(() => {
      service = new GooglePlayService();
      jest.clearAllMocks();
    });

    describe('fetchReviews', () => {
      it('should fetch reviews for specific language', async () => {
        const mockReviews = [
          { id: '1', userName: 'User1', userImage: 'img1', score: 5, date: '2024-01-01' },
          { id: '2', userName: 'User2', userImage: 'img2', score: 4, date: '2024-01-02' },
        ];

        mockGplay.reviews.mockResolvedValue({ data: mockReviews });

        const options: ReviewOptions = {
          appId: 'com.iqoption',
          country: 'vn',
          lang: 'vi',
          num: 10,
        };

        const result = await service.fetchReviews(options);
        expect(result).toHaveLength(2);
        expect(mockGplay.reviews).toHaveBeenCalledWith({
          num: 10,
          sort: 'NEWEST',
          appId: 'com.iqoption',
          country: 'vn',
          lang: 'vi',
        });
      });

      it('should fetch reviews in all languages when no specific language', async () => {
        const mockReviews = [
          { id: '1', userName: 'User1', userImage: 'img1', score: 5, date: '2024-01-01' },
        ];

        mockGplay.reviews.mockResolvedValue({ data: mockReviews });

        const options: ReviewOptions = {
          appId: 'com.iqoption',
          country: 'vn',
          num: 5,
        };

        const result = await service.fetchReviews(options);
        expect(result.length).toBeGreaterThan(0);
        expect(mockGplay.reviews).toHaveBeenCalled();
      });

      it('should handle errors gracefully', async () => {
        mockGplay.reviews.mockRejectedValue(new Error('API Error'));

        const options: ReviewOptions = {
          appId: 'com.iqoption',
          country: 'vn',
        };

        await expect(service.fetchReviews(options)).rejects.toThrow('Failed to fetch reviews from Google Play Store');
      });
    });

    describe('fetchAppInfo', () => {
      it('should fetch app information', async () => {
        const mockAppInfo = {
          appId: 'com.iqoption',
          title: 'IQ Option',
          developer: 'IQ Option Ltd',
        };

        mockGplay.app.mockResolvedValue(mockAppInfo);

        const result = await service.fetchAppInfo('com.iqoption');
        expect(result).toEqual(mockAppInfo);
        expect(mockGplay.app).toHaveBeenCalledWith({ appId: 'com.iqoption' });
      });
    });

    describe('searchApps', () => {
      it('should search for apps', async () => {
        const mockApps = [
          { appId: 'com.iqoption', title: 'IQ Option' },
          { appId: 'com.test.app', title: 'Test App' },
        ];

        mockGplay.search.mockResolvedValue(mockApps);

        const result = await service.searchApps('iq option', 10);
        expect(result).toEqual(mockApps);
        expect(mockGplay.search).toHaveBeenCalledWith({
          term: 'iq option',
          num: 10,
        });
      });
    });

    describe('getAppSuggestions', () => {
      it('should get app suggestions', async () => {
        const mockSuggestions = ['iq option', 'iq option pro', 'iq option lite'];

        mockGplay.suggest.mockResolvedValue(mockSuggestions);

        const result = await service.getAppSuggestions('iq option');
        expect(result).toEqual(mockSuggestions);
        expect(mockGplay.suggest).toHaveBeenCalledWith({ term: 'iq option' });
      });
    });

    describe('convertToReviewType', () => {
      it('should convert scraper review to our Review type', () => {
        const scraperReview = {
          id: 'test-id',
          userName: 'Test User',
          userImage: 'test-image.jpg',
          text: 'Test review content',
          score: 5,
          thumbsUp: 10,
          version: '1.0.0',
          date: '2024-01-01',
          replyContent: 'Test reply',
          replyDate: '2024-01-02',
        };

        // Access private method for testing
        const result = (service as any).convertToReviewType(scraperReview);

        expect(result).toEqual({
          id: 'test-id',
          userName: 'Test User',
          userImage: 'test-image.jpg',
          content: 'Test review content',
          text: 'Test review content',
          score: 5,
          thumbsUpCount: 10,
          thumbsUp: 10,
          reviewCreatedVersion: '1.0.0',
          version: '1.0.0',
          at: '2024-01-01',
          date: '2024-01-01',
          replyContent: 'Test reply',
          repliedAt: '2024-01-02',
          replyDate: '2024-01-02',
          replyText: undefined,
          scoreText: undefined,
          url: undefined,
          title: undefined,
          criterias: undefined,
        });
      });
    });
  });

  describe('SwaggerService', () => {
    let service: SwaggerService;

    beforeEach(() => {
      service = new SwaggerService();
    });

    describe('generateSwaggerSpec', () => {
      it('should generate valid OpenAPI specification', () => {
        const baseUrl = 'https://api.example.com';
        const spec = service.generateSwaggerSpec(baseUrl);

        expect(spec.openapi).toBe('3.0.0');
        expect(spec.info.title).toBe('Google Reviews API');
        expect(spec.info.version).toBe('2.0.0');
        expect(spec.servers).toHaveLength(1);
        expect(spec.servers[0]?.url).toBe(baseUrl);
        expect(spec.paths).toBeDefined();
        expect(spec.components).toBeDefined();
      });

      it('should include all required endpoints', () => {
        const baseUrl = 'https://api.example.com';
        const spec = service.generateSwaggerSpec(baseUrl);

        expect(spec.paths['/app']).toBeDefined();
        expect(spec.paths['/swagger']).toBeDefined();
        expect(spec.paths['/swagger.json']).toBeDefined();
      });

      it('should include proper schemas', () => {
        const baseUrl = 'https://api.example.com';
        const spec = service.generateSwaggerSpec(baseUrl);

        expect(spec.components.schemas.Review).toBeDefined();
        expect(spec.components.schemas.ReviewResponse).toBeDefined();
        expect(spec.components.schemas.ApiError).toBeDefined();
      });
    });

    describe('generateSwaggerUI', () => {
      it('should generate valid HTML', () => {
        const baseUrl = 'https://api.example.com';
        const html = service.generateSwaggerUI(baseUrl);

        expect(html).toContain('<!DOCTYPE html>');
        expect(html).toContain('<title>Google Reviews API - Swagger Documentation</title>');
        expect(html).toContain('swagger-ui');
        expect(html).toContain(baseUrl);
      });

      it('should include proper styling and scripts', () => {
        const baseUrl = 'https://api.example.com';
        const html = service.generateSwaggerUI(baseUrl);

        expect(html).toContain('swagger-ui.css');
        expect(html).toContain('swagger-ui-bundle.js');
        expect(html).toContain('swagger-ui-standalone-preset.js');
      });
    });
  });
});
