import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../src/app';
import { googlePlayService } from '../src/services/googlePlayService';

// Test configuration
const TEST_APP_ID = 'com.iqoption';
const TEST_COUNTRY = 'vn';
const TEST_LANGUAGE = 'vi';

describe('API Integration Tests', () => {
  let server: any;

  beforeAll(async () => {
    // Start the server for integration tests
    const PORT = process.env.TEST_PORT || 3001;
    server = app.listen(PORT);
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  beforeEach(async () => {
    // Add delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  describe('Health and Info Endpoints', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('memory');
      expect(response.body).toHaveProperty('version');
    });

    it('should return API information', async () => {
      const response = await request(app)
        .get('/info')
        .expect(200);

      expect(response.body).toHaveProperty('name', 'Google Reviews API');
      expect(response.body).toHaveProperty('version', '2.0.0');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body).toHaveProperty('features');
    });
  });

  describe('Swagger Documentation', () => {
    it('should serve Swagger UI', async () => {
      const response = await request(app)
        .get('/swagger')
        .expect(200);

      expect(response.headers['content-type']).toContain('text/html');
      expect(response.text).toContain('Swagger UI');
      expect(response.text).toContain('Google Reviews API');
    });

    it('should serve OpenAPI specification', async () => {
      const response = await request(app)
        .get('/swagger.json')
        .expect(200);

      expect(response.headers['content-type']).toContain('application/json');
      expect(response.body).toHaveProperty('openapi', '3.0.0');
      expect(response.body).toHaveProperty('info.title', 'Google Reviews API');
      expect(response.body).toHaveProperty('paths./app');
    });
  });

  describe('Reviews API - com.iqoption (Vietnam)', () => {
    it('should fetch reviews for com.iqoption in Vietnam', async () => {
      const response = await request(app)
        .get('/app')
        .query({
          appid: TEST_APP_ID,
          country: TEST_COUNTRY,
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('statusCode', 200);
      expect(response.body).toHaveProperty('timestamp');

      const reviews = response.body.data.data;
      expect(Array.isArray(reviews)).toBe(true);
      
      if (reviews.length > 0) {
        const review = reviews[0];
        expect(review).toHaveProperty('id');
        expect(review).toHaveProperty('userName');
        expect(review).toHaveProperty('userImage');
        expect(review).toHaveProperty('score');
        expect(review).toHaveProperty('date');
        
        // Log some review data for verification
        console.log(`✅ Fetched ${reviews.length} reviews for ${TEST_APP_ID} in ${TEST_COUNTRY}`);
        console.log(`📱 Sample review: ${review.userName} - Score: ${review.score} - Date: ${review.date}`);
      }
    }, 30000);

    it('should fetch reviews for com.iqoption in Vietnam with Vietnamese language', async () => {
      const response = await request(app)
        .get('/app')
        .query({
          appid: TEST_APP_ID,
          country: TEST_COUNTRY,
          lang: TEST_LANGUAGE,
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.data).toBeDefined();

      const reviews = response.body.data.data;
      if (reviews.length > 0) {
        console.log(`✅ Fetched ${reviews.length} Vietnamese reviews for ${TEST_APP_ID} in ${TEST_COUNTRY}`);
      }
    }, 30000);

    it('should handle missing appid parameter', async () => {
      const response = await request(app)
        .get('/app')
        .query({
          country: TEST_COUNTRY,
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Missing required parameter: appid');
      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('should handle invalid appid format', async () => {
      const response = await request(app)
        .get('/app')
        .query({
          appid: 'invalid-app-id',
          country: TEST_COUNTRY,
        })
        .expect(200); // Should still work but may return empty results

      expect(response.body).toHaveProperty('success', true);
    });
  });

  describe('App Information API', () => {
    it('should fetch app information for com.iqoption', async () => {
      const response = await request(app)
        .get('/app/info')
        .query({
          appid: TEST_APP_ID,
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('statusCode', 200);

      const appInfo = response.body.data;
      if (appInfo) {
        console.log(`✅ App Info for ${TEST_APP_ID}:`, {
          title: appInfo.title,
          developer: appInfo.developer,
          score: appInfo.score,
          installs: appInfo.installs,
        });
      }
    }, 30000);

    it('should handle missing appid for app info', async () => {
      const response = await request(app)
        .get('/app/info')
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Missing required parameter: appid');
    });
  });

  describe('App Search API', () => {
    it('should search for apps with query "iq option"', async () => {
      const response = await request(app)
        .get('/app/search')
        .query({
          q: 'iq option',
          limit: 5,
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeInstanceOf(Array);

      const apps = response.body.data;
      if (apps.length > 0) {
        console.log(`✅ Search results for "iq option": ${apps.length} apps found`);
        apps.slice(0, 3).forEach((app: any, index: number) => {
          console.log(`   ${index + 1}. ${app.title} (${app.appId})`);
        });
      }
    }, 30000);

    it('should handle missing search query', async () => {
      const response = await request(app)
        .get('/app/search')
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Missing required parameter: q (search query)');
    });
  });

  describe('App Suggestions API', () => {
    it('should get app suggestions for "iq"', async () => {
      const response = await request(app)
        .get('/app/suggestions')
        .query({
          q: 'iq',
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeInstanceOf(Array);

      const suggestions = response.body.data;
      if (suggestions.length > 0) {
        console.log(`✅ Suggestions for "iq": ${suggestions.length} suggestions found`);
        suggestions.slice(0, 5).forEach((suggestion: string, index: number) => {
          console.log(`   ${index + 1}. ${suggestion}`);
        });
      }
    }, 30000);

    it('should handle missing query for suggestions', async () => {
      const response = await request(app)
        .get('/app/suggestions')
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Missing required parameter: q (search query)');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Route not found');
      expect(response.body).toHaveProperty('statusCode', 404);
    });

    it('should handle malformed requests gracefully', async () => {
      const response = await request(app)
        .get('/app')
        .query({
          appid: '',
          country: 'invalid-country-code',
        })
        .expect(200); // Should still work but may return empty results

      expect(response.body).toHaveProperty('success', true);
    });
  });

  describe('Performance and Reliability', () => {
    it('should handle multiple concurrent requests', async () => {
      const requests = Array(3).fill(null).map(() =>
        request(app)
          .get('/app')
          .query({
            appid: TEST_APP_ID,
            country: TEST_COUNTRY,
            num: 5,
          })
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
      });

      console.log(`✅ Successfully handled ${requests.length} concurrent requests`);
    }, 60000);

    it('should return consistent response structure', async () => {
      const response = await request(app)
        .get('/app')
        .query({
          appid: TEST_APP_ID,
          country: TEST_COUNTRY,
          num: 10,
        })
        .expect(200);

      // Verify response structure
      expect(response.body).toMatchObject({
        success: true,
        statusCode: 200,
        data: {
          data: expect.any(Array),
        },
        timestamp: expect.any(String),
      });

      // Verify timestamp format
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.getTime()).not.toBeNaN();
      expect(timestamp).toBeInstanceOf(Date);
    }, 30000);
  });

  describe('Data Quality and Validation', () => {
    it('should return valid review data structure', async () => {
      const response = await request(app)
        .get('/app')
        .query({
          appid: TEST_APP_ID,
          country: TEST_COUNTRY,
          num: 5,
        })
        .expect(200);

      const reviews = response.body.data.data;
      if (reviews.length > 0) {
        const review = reviews[0];
        
        // Validate required fields
        expect(review.id).toBeDefined();
        expect(review.userName).toBeDefined();
        expect(review.score).toBeDefined();
        expect(review.date).toBeDefined();
        
        // Validate data types
        expect(typeof review.id).toBe('string');
        expect(typeof review.userName).toBe('string');
        expect(typeof review.score).toBe('number');
        expect(typeof review.date).toBe('string');
        
        // Validate score range
        expect(review.score).toBeGreaterThanOrEqual(1);
        expect(review.score).toBeLessThanOrEqual(5);
        
        // Validate date format
        const reviewDate = new Date(review.date);
        expect(reviewDate.getTime()).not.toBeNaN();
        
        console.log(`✅ Review data validation passed for: ${review.userName} (Score: ${review.score})`);
      }
    }, 30000);

    it('should handle different review counts', async () => {
      const testCounts = [5, 10, 20];
      
      for (const count of testCounts) {
        const response = await request(app)
          .get('/app')
          .query({
            appid: TEST_APP_ID,
            country: TEST_COUNTRY,
            num: count,
          })
          .expect(200);

        const reviews = response.body.data.data;
        expect(Array.isArray(reviews)).toBe(true);
        
        // Note: Actual count may be less than requested due to available data
        console.log(`✅ Requested ${count} reviews, got ${reviews.length} reviews`);
        
        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }, 90000);
  });
});
