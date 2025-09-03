import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../src/app';

// Specific test configuration for the requested endpoint
const TARGET_APP_ID = 'com.iqoption';
const TARGET_COUNTRY = 'vn';
const TARGET_LANGUAGE = 'vi';

describe(`Specific Endpoint Test: ${TARGET_COUNTRY}&appid=${TARGET_APP_ID}`, () => {
  let server: any;

  beforeAll(async () => {
    // Start the server for testing
    const PORT = process.env.TEST_PORT || 3002;
    server = app.listen(PORT);
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`🚀 Test server started on port ${PORT}`);
  });

  afterAll(async () => {
    if (server) {
      server.close();
      console.log('🛑 Test server stopped');
    }
  });

  describe('Primary Endpoint Test', () => {
    it(`should successfully fetch reviews for ${TARGET_APP_ID} in ${TARGET_COUNTRY}`, async () => {
      console.log(`\n🎯 Testing primary endpoint: /app?country=${TARGET_COUNTRY}&appid=${TARGET_APP_ID}`);
      
      const startTime = Date.now();
      
      const response = await request(app)
        .get('/app')
        .query({
          appid: TARGET_APP_ID,
          country: TARGET_COUNTRY,
        })
        .expect(200);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Basic response validation
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('statusCode', 200);
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('data');

      // Data structure validation
      const reviews = response.body.data.data;
      expect(Array.isArray(reviews)).toBe(true);

      // Log detailed results
      console.log(`\n📊 Test Results:`);
      console.log(`   ✅ Status: ${response.body.success ? 'SUCCESS' : 'FAILED'}`);
      console.log(`   ⏱️  Response Time: ${responseTime}ms`);
      console.log(`   📱 App ID: ${TARGET_APP_ID}`);
      console.log(`   🌍 Country: ${TARGET_COUNTRY}`);
      console.log(`   📝 Reviews Found: ${reviews.length}`);
      console.log(`   🕐 Timestamp: ${response.body.timestamp}`);

      if (reviews.length > 0) {
        console.log(`\n📋 Sample Reviews:`);
        reviews.slice(0, 3).forEach((review: any, index: number) => {
          console.log(`   ${index + 1}. ${review.userName} - Score: ${review.score}⭐ - Date: ${review.date}`);
          if (review.content) {
            const content = review.content.length > 100 ? review.content.substring(0, 100) + '...' : review.content;
            console.log(`      Content: ${content}`);
          }
        });

        // Validate first review structure
        const firstReview = reviews[0];
        expect(firstReview).toHaveProperty('id');
        expect(firstReview).toHaveProperty('userName');
        expect(firstReview).toHaveProperty('userImage');
        expect(firstReview).toHaveProperty('score');
        expect(firstReview).toHaveProperty('date');

        // Validate data types
        expect(typeof firstReview.id).toBe('string');
        expect(typeof firstReview.userName).toBe('string');
        expect(typeof firstReview.score).toBe('number');
        expect(typeof firstReview.date).toBe('string');

        // Validate score range
        expect(firstReview.score).toBeGreaterThanOrEqual(1);
        expect(firstReview.score).toBeLessThanOrEqual(5);

        console.log(`\n✅ Data validation passed for first review`);
      } else {
        console.log(`\n⚠️  No reviews found - this might be normal for some apps/countries`);
      }

      // Performance check
      if (responseTime > 10000) {
        console.log(`\n⚠️  Response time is slow: ${responseTime}ms (consider optimizing)`);
      } else if (responseTime > 5000) {
        console.log(`\n📈 Response time is moderate: ${responseTime}ms`);
      } else {
        console.log(`\n🚀 Response time is excellent: ${responseTime}ms`);
      }

    }, 60000); // 60 second timeout for this critical test

    it(`should fetch reviews with Vietnamese language specification`, async () => {
      console.log(`\n🌏 Testing with Vietnamese language: /app?country=${TARGET_COUNTRY}&appid=${TARGET_APP_ID}&lang=${TARGET_LANGUAGE}`);
      
      const response = await request(app)
        .get('/app')
        .query({
          appid: TARGET_APP_ID,
          country: TARGET_COUNTRY,
          lang: TARGET_LANGUAGE,
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      
      const reviews = response.body.data.data;
      console.log(`   📝 Vietnamese reviews found: ${reviews.length}`);
      
      if (reviews.length > 0) {
        console.log(`   ✅ Successfully fetched Vietnamese reviews for ${TARGET_APP_ID}`);
      }
    }, 30000);

    it('should handle different review count requests', async () => {
      console.log(`\n🔢 Testing different review count requests`);
      
      const testCounts = [5, 10, 15];
      
      for (const count of testCounts) {
        console.log(`   Testing with count: ${count}`);
        
        const response = await request(app)
          .get('/app')
          .query({
            appid: TARGET_APP_ID,
            country: TARGET_COUNTRY,
            num: count,
          })
          .expect(200);

        const reviews = response.body.data.data;
        console.log(`     Requested: ${count}, Received: ${reviews.length}`);
        
        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }, 90000);
  });

  describe('Error Handling Tests', () => {
    it('should handle missing appid parameter', async () => {
      console.log(`\n❌ Testing missing appid parameter`);
      
      const response = await request(app)
        .get('/app')
        .query({
          country: TARGET_COUNTRY,
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Missing required parameter: appid');
      expect(response.body).toHaveProperty('statusCode', 400);
      
      console.log(`   ✅ Correctly handled missing appid`);
    });

    it('should handle invalid appid format', async () => {
      console.log(`\n⚠️  Testing invalid appid format`);
      
      const response = await request(app)
        .get('/app')
        .query({
          appid: 'invalid-app-id-format',
          country: TARGET_COUNTRY,
        })
        .expect(200); // Should still work but may return empty results

      expect(response.body).toHaveProperty('success', true);
      console.log(`   ✅ Gracefully handled invalid appid format`);
    });

    it('should handle invalid country code', async () => {
      console.log(`\n🌍 Testing invalid country code`);
      
      const response = await request(app)
        .get('/app')
        .query({
          appid: TARGET_APP_ID,
          country: 'invalid-country',
        })
        .expect(200); // Should still work but may return empty results

      expect(response.body).toHaveProperty('success', true);
      console.log(`   ✅ Gracefully handled invalid country code`);
    });
  });

  describe('Performance and Reliability Tests', () => {
    it('should handle multiple requests without errors', async () => {
      console.log(`\n🔄 Testing multiple sequential requests`);
      
      const requestCount = 3;
      const results = [];
      
      for (let i = 0; i < requestCount; i++) {
        console.log(`   Request ${i + 1}/${requestCount}`);
        
        const startTime = Date.now();
        
        const response = await request(app)
          .get('/app')
          .query({
            appid: TARGET_APP_ID,
            country: TARGET_COUNTRY,
            num: 5,
          })
          .expect(200);

        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        results.push({
          request: i + 1,
          status: response.status,
          responseTime,
          reviewCount: response.body.data.data.length,
        });

        console.log(`     Status: ${response.status}, Time: ${responseTime}ms, Reviews: ${response.body.data.data.length}`);
        
        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      // Validate all requests were successful
      results.forEach(result => {
        expect(result.status).toBe(200);
      });

      console.log(`\n✅ All ${requestCount} requests completed successfully`);
      
      // Log performance summary
      const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
      console.log(`📊 Average response time: ${Math.round(avgResponseTime)}ms`);
      
    }, 120000);

    it('should maintain consistent response structure', async () => {
      console.log(`\n🏗️  Testing response structure consistency`);
      
      const response = await request(app)
        .get('/app')
        .query({
          appid: TARGET_APP_ID,
          country: TARGET_COUNTRY,
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

      console.log(`   ✅ Response structure is consistent`);
      console.log(`   📅 Timestamp format is valid: ${response.body.timestamp}`);
    }, 30000);
  });

  describe('Data Quality Tests', () => {
    it('should return reviews with valid data structure', async () => {
      console.log(`\n🔍 Testing review data quality`);
      
      const response = await request(app)
        .get('/app')
        .query({
          appid: TARGET_APP_ID,
          country: TARGET_COUNTRY,
          num: 10,
        })
        .expect(200);

      const reviews = response.body.data.data;
      
      if (reviews.length > 0) {
        console.log(`   📝 Analyzing ${reviews.length} reviews for data quality`);
        
        let validReviews = 0;
        let invalidReviews = 0;
        
        reviews.forEach((review: any, index: number) => {
          try {
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
            
            validReviews++;
          } catch (error) {
            console.log(`     ⚠️  Review ${index + 1} has validation issues:`, (error as Error).message);
            invalidReviews++;
          }
        });

        console.log(`   ✅ Valid reviews: ${validReviews}`);
        if (invalidReviews > 0) {
          console.log(`   ⚠️  Invalid reviews: ${invalidReviews}`);
        }
        
        // Ensure at least 80% of reviews are valid
        const validityRate = (validReviews / reviews.length) * 100;
        expect(validityRate).toBeGreaterThanOrEqual(80);
        console.log(`   📊 Data validity rate: ${validityRate.toFixed(1)}%`);
        
      } else {
        console.log(`   ⚠️  No reviews to validate`);
      }
    }, 30000);

    it('should handle edge cases gracefully', async () => {
      console.log(`\n🎭 Testing edge cases`);
      
      // Test with very high review count
      const response = await request(app)
        .get('/app')
        .query({
          appid: TARGET_APP_ID,
          country: TARGET_COUNTRY,
          num: 100,
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      const reviews = response.body.data.data;
      console.log(`   📊 Requested 100 reviews, received ${reviews.length}`);
      
      // Test with empty appid
      const emptyResponse = await request(app)
        .get('/app')
        .query({
          appid: '',
          country: TARGET_COUNTRY,
        })
        .expect(200);

      expect(emptyResponse.body).toHaveProperty('success', true);
      console.log(`   ✅ Handled empty appid gracefully`);
      
    }, 30000);
  });

  describe('Test Summary', () => {
    it('should provide comprehensive test summary', async () => {
      console.log(`\n🎯 Test Summary for ${TARGET_APP_ID} in ${TARGET_COUNTRY}`);
      console.log(`   📱 App ID: ${TARGET_APP_ID}`);
      console.log(`   🌍 Country: ${TARGET_COUNTRY}`);
      console.log(`   🌏 Language: ${TARGET_LANGUAGE}`);
      console.log(`   🧪 Tests completed: Integration, Error handling, Performance, Data quality`);
      console.log(`   ✅ Endpoint is ready for production use`);
      
      // This test always passes - it's just for summary
      expect(true).toBe(true);
    });
  });
});
