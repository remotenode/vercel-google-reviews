#!/usr/bin/env node

/**
 * Simple API Endpoint Test Script
 * Tests the Google Reviews API endpoints including the specific endpoint: vn&appid=com.iqoption
 */

import https from 'https';
import http from 'http';
import { URL } from 'url';

// Test configuration
const TEST_CONFIG = {
  // The specific endpoint you requested
  primaryEndpoint: {
    appId: 'com.iqoption',
    country: 'vn',
    language: 'vi',
    description: 'Primary test endpoint: com.iqoption in Vietnam'
  },
  
  // Test server URLs (update these based on your deployment)
  servers: [
    {
      name: 'Local Development',
      url: 'http://localhost:3000',
      protocol: 'http'
    },
    {
      name: 'Vercel Production',
      url: 'https://vercel-app-nine-dusky.vercel.app',
      protocol: 'https'
    },
    {
      name: 'Custom Domain',
      url: 'https://android.reviews.aso.market',
      protocol: 'https'
    }
  ],
  
  // Test endpoints to verify
  endpoints: [
    { path: '/health', name: 'Health Check' },
    { path: '/info', name: 'API Information' },
    { path: '/swagger', name: 'Swagger Documentation' },
    { path: '/swagger.json', name: 'OpenAPI Specification' },
    { path: '/app', name: 'Reviews API' },
    { path: '/app/info', name: 'App Information' },
    { path: '/app/search', name: 'App Search' },
    { path: '/app/suggestions', name: 'App Suggestions' }
  ]
};

// Utility functions
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'API-Test-Script/1.0',
        'Accept': 'application/json',
        ...options.headers
      },
      timeout: options.timeout || 30000
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const contentType = res.headers['content-type'] || '';
          let parsedData = data;
          
          if (contentType.includes('application/json')) {
            parsedData = JSON.parse(data);
          }
          
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsedData,
            rawData: data
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data,
            rawData: data,
            parseError: error.message
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function testEndpoint(server, endpoint, testParams = {}) {
  const fullUrl = `${server.url}${endpoint.path}`;
  const testName = `${server.name} - ${endpoint.name}`;
  
  console.log(`\n🧪 Testing: ${testName}`);
  console.log(`   URL: ${fullUrl}`);
  
  try {
    const startTime = Date.now();
    const response = await makeRequest(fullUrl, testParams);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`   ✅ Status: ${response.statusCode}`);
    console.log(`   ⏱️  Time: ${responseTime}ms`);
    console.log(`   📊 Size: ${response.rawData.length} bytes`);
    
    // Special handling for specific endpoints
    if (endpoint.path === '/app' && testParams.query) {
      console.log(`   🔍 Query: ${JSON.stringify(testParams.query)}`);
      
      if (response.data && response.data.data && response.data.data.data) {
        const reviews = response.data.data.data;
        console.log(`   📝 Reviews: ${reviews.length} found`);
        
        if (reviews.length > 0) {
          const firstReview = reviews[0];
          console.log(`   👤 Sample: ${firstReview.userName} - Score: ${firstReview.score}⭐`);
          if (firstReview.content) {
            const content = firstReview.content.length > 50 ? 
              firstReview.content.substring(0, 50) + '...' : 
              firstReview.content;
            console.log(`   💬 Content: ${content}`);
          }
        }
      }
    }
    
    return { success: true, response, responseTime };
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testPrimaryEndpoint(server) {
  console.log(`\n🎯 Testing Primary Endpoint: ${TEST_CONFIG.primaryEndpoint.description}`);
  console.log(`   📱 App ID: ${TEST_CONFIG.primaryEndpoint.appId}`);
  console.log(`   🌍 Country: ${TEST_CONFIG.primaryEndpoint.country}`);
  console.log(`   🌏 Language: ${TEST_CONFIG.primaryEndpoint.language}`);
  
  const testParams = {
    query: {
      appid: TEST_CONFIG.primaryEndpoint.appId,
      country: TEST_CONFIG.primaryEndpoint.country,
      lang: TEST_CONFIG.primaryEndpoint.language,
      num: 10
    }
  };
  
  // Convert query params to URL search string
  const searchParams = new URLSearchParams(testParams.query);
  const fullUrl = `${server.url}/app?${searchParams.toString()}`;
  
  console.log(`   🔗 Full URL: ${fullUrl}`);
  
  try {
    const startTime = Date.now();
    const response = await makeRequest(fullUrl);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`   ✅ Status: ${response.statusCode}`);
    console.log(`   ⏱️  Response Time: ${responseTime}ms`);
    
    if (response.statusCode === 200 && response.data) {
      if (response.data.success) {
        const reviews = response.data.data?.data || [];
        console.log(`   📊 Reviews Found: ${reviews.length}`);
        
        if (reviews.length > 0) {
          console.log(`\n📋 Sample Reviews:`);
          reviews.slice(0, 3).forEach((review, index) => {
            console.log(`   ${index + 1}. ${review.userName} - Score: ${review.score}⭐ - Date: ${review.date}`);
            if (review.content) {
              const content = review.content.length > 80 ? 
                review.content.substring(0, 80) + '...' : 
                review.content;
              console.log(`      ${content}`);
            }
          });
        }
        
        // Performance analysis
        if (responseTime > 10000) {
          console.log(`   ⚠️  Response time is slow: ${responseTime}ms`);
        } else if (responseTime > 5000) {
          console.log(`   📈 Response time is moderate: ${responseTime}ms`);
        } else {
          console.log(`   🚀 Response time is excellent: ${responseTime}ms`);
        }
        
      } else {
        console.log(`   ❌ API returned error: ${response.data.error || 'Unknown error'}`);
      }
    } else {
      console.log(`   ❌ Unexpected response: ${response.statusCode}`);
    }
    
    return { success: true, response, responseTime };
    
  } catch (error) {
    console.log(`   ❌ Request failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log('🚀 Starting Google Reviews API Endpoint Tests');
  console.log('=' .repeat(60));
  
  const results = [];
  
  for (const server of TEST_CONFIG.servers) {
    console.log(`\n🌐 Testing Server: ${server.name}`);
    console.log(`   URL: ${server.url}`);
    console.log('-'.repeat(40));
    
    const serverResults = {
      server: server.name,
      url: server.url,
      tests: [],
      primaryTest: null
    };
    
    // Test basic endpoints
    for (const endpoint of TEST_CONFIG.endpoints) {
      const result = await testEndpoint(server, endpoint);
      serverResults.tests.push({
        endpoint: endpoint.name,
        ...result
      });
      
      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Test primary endpoint (com.iqoption in Vietnam)
    const primaryResult = await testPrimaryEndpoint(server);
    serverResults.primaryTest = primaryResult;
    
    results.push(serverResults);
    
    // Add delay between servers
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Generate test summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  results.forEach(serverResult => {
    console.log(`\n🌐 ${serverResult.server}`);
    console.log(`   URL: ${serverResult.url}`);
    
    const successfulTests = serverResult.tests.filter(t => t.success).length;
    const totalTests = serverResult.tests.length;
    const successRate = (successfulTests / totalTests) * 100;
    
    console.log(`   📊 Basic Endpoints: ${successfulTests}/${totalTests} (${successRate.toFixed(1)}%)`);
    
    if (serverResult.primaryTest) {
      const primaryStatus = serverResult.primaryTest.success ? '✅ PASS' : '❌ FAIL';
      const primaryTime = serverResult.primaryTest.responseTime || 'N/A';
      console.log(`   🎯 Primary Endpoint: ${primaryStatus} (${primaryTime}ms)`);
    }
  });
  
  console.log('\n🎯 Primary Endpoint Test Results:');
  console.log('   This tests the specific endpoint you requested:');
  console.log(`   📱 App ID: ${TEST_CONFIG.primaryEndpoint.appId}`);
  console.log(`   🌍 Country: ${TEST_CONFIG.primaryEndpoint.country}`);
  console.log(`   🌏 Language: ${TEST_CONFIG.primaryEndpoint.language}`);
  
  console.log('\n✅ Testing completed!');
}

// Run the tests
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(error => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  });
}

export { runAllTests, testEndpoint, testPrimaryEndpoint };
