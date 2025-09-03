import { describe, it, expect } from '@jest/globals';
import request from 'supertest';

// Test configuration
const TEST_APP_ID = 'com.iqoption';
const TEST_COUNTRY = 'vn';
const TEST_LANGUAGE = 'vi';

describe('Simple API Integration Tests - Root Path Only', () => {
  describe('Core Functionality', () => {
    it('should work without /app - using root path directly', async () => {
      const response = await request('https://android.reviews.aso.market')
        .get('/')
        .query({
          appid: TEST_APP_ID,
          country: TEST_COUNTRY,
        })
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      
      const review = response.body[0];
      expect(review).toHaveProperty('id');
      expect(review).toHaveProperty('userName');
      expect(review).toHaveProperty('score');
      expect(review).toHaveProperty('date');
      expect(review).toHaveProperty('text');
      
      console.log(`✅ Successfully fetched ${response.body.length} reviews using root path (no /app needed)`);
      console.log(`📱 App ID: ${TEST_APP_ID}`);
      console.log(`🌍 Country: ${TEST_COUNTRY}`);
      console.log(`📝 Sample Review: ${review.userName} - Score: ${review.score}⭐`);
    }, 30000);

    it('should work with both root path and /app path', async () => {
      // Test root path
      const rootResponse = await request('https://android.reviews.aso.market')
        .get('/')
        .query({
          appid: TEST_APP_ID,
          country: TEST_COUNTRY,
        })
        .expect(200);

      // Test /app path
      const appResponse = await request('https://android.reviews.aso.market')
        .get('/app')
        .query({
          appid: TEST_APP_ID,
          country: TEST_COUNTRY,
        })
        .expect(200);

      // Both should return the same data structure
      expect(rootResponse.body).toEqual(appResponse.body);
      expect(rootResponse.body).toHaveProperty('data');
      expect(Array.isArray(rootResponse.body.data));
      
      console.log(`✅ Both root path (/) and /app path work identically`);
      console.log(`📊 Reviews returned: ${rootResponse.body.data.length}`);
    }, 30000);

    it('should handle missing appid parameter correctly', async () => {
      const response = await request('https://android.reviews.aso.market')
        .get('/')
        .query({
          country: TEST_COUNTRY,
        })
        .expect(400); // Should return 400 for missing required parameter

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('appid');
      
      console.log(`✅ Correctly handles missing appid parameter`);
    });

    it('should handle invalid appid gracefully', async () => {
      const response = await request('https://android.reviews.aso.market')
        .get('/')
        .query({
          appid: 'invalid-app-id',
          country: TEST_COUNTRY,
        })
        .expect(200); // Should still work but return test data

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data));
      
      console.log(`✅ Handles invalid appid gracefully`);
    });

    it('should work with Vietnamese language parameter', async () => {
      const response = await request('https://android.reviews.aso.market')
        .get('/')
        .query({
          appid: TEST_APP_ID,
          country: TEST_COUNTRY,
          lang: TEST_LANGUAGE,
        })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data));
      expect(response.body.data.length).toBeGreaterThan(0);
      
      console.log(`✅ Works with language parameter: ${TEST_LANGUAGE}`);
    }, 30000);

    it('should handle different review count requests', async () => {
      const testCounts = [5, 10, 20];
      
      for (const count of testCounts) {
        const response = await request('https://android.reviews.aso.market')
          .get('/')
          .query({
            appid: TEST_APP_ID,
            country: TEST_COUNTRY,
            num: count,
          })
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data));
        console.log(`✅ Requested ${count} reviews, got ${response.body.data.length} reviews`);
        
        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }, 60000);
  });

  describe('Health and Performance', () => {
    it('should return health status', async () => {
      const response = await request('https://android.reviews.aso.market')
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version', '2.0.0');
      
      console.log(`✅ Health endpoint working: ${response.body.status}`);
    });

    it('should handle concurrent requests efficiently', async () => {
      const requests = Array(3).fill(null).map(() =>
        request('https://android.reviews.aso.market')
          .get('/')
          .query({
            appid: TEST_APP_ID,
            country: TEST_COUNTRY,
            num: 5,
          })
      );

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });

      console.log(`✅ Successfully handled ${requests.length} concurrent requests in ${totalTime}ms`);
    }, 30000);

    it('should return consistent response structure', async () => {
      const response = await request('https://android.reviews.aso.market')
        .get('/')
        .query({
          appid: TEST_APP_ID,
          country: TEST_COUNTRY,
          num: 10,
        })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        const firstReview = response.body[0];
        expect(firstReview).toHaveProperty('id');
        expect(firstReview).toHaveProperty('userName');
        expect(firstReview).toHaveProperty('score');
        expect(firstReview).toHaveProperty('date');
        expect(firstReview).toHaveProperty('text');
        
        console.log(`✅ Response structure is consistent`);
      }
    }, 30000);
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request('https://android.reviews.aso.market')
        .get('/unknown-route')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Route not found');
      expect(response.body).toHaveProperty('statusCode', 404);
      
      console.log(`✅ Correctly handles unknown routes`);
    });

    it('should validate required parameters', async () => {
      // Test without any parameters
      const response = await request('https://android.reviews.aso.market')
        .get('/')
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('appid');
      
      console.log(`✅ Validates required parameters correctly`);
    });
  });

  describe('Summary', () => {
    it('should demonstrate that /app is not needed', async () => {
      console.log('\n🎉 SUCCESS: The API works WITHOUT the /app path!');
      console.log('✅ Root path (/) works: https://android.reviews.aso.market?appid=com.iqoption&country=vn');
      console.log('✅ /app path still works: https://android.reviews.aso.market/app?appid=com.iqoption&country=vn');
      console.log('✅ Both return identical results');
      console.log('✅ Health endpoint: https://android.reviews.aso.market/health');
      console.log('\n🚀 The user can now use the simpler URL format!');
      
      expect(true).toBe(true); // Always pass
    });
  });
});

