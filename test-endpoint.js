#!/usr/bin/env node

/**
 * Simple Endpoint Test Script
 * Tests the specific endpoint: vn&appid=com.iqoption
 */

import https from 'https';
import http from 'http';
import { URL } from 'url';

// Test configuration
const TARGET_APP_ID = 'com.iqoption';
const TARGET_COUNTRY = 'vn';
const TARGET_LANGUAGE = 'vi';

// Test servers
const TEST_SERVERS = [
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
];

// Utility function to make HTTP requests
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

// Test the specific endpoint
async function testSpecificEndpoint(server) {
  console.log(`\n🎯 Testing: ${server.name}`);
  console.log(`   URL: ${server.url}`);
  console.log(`   📱 App ID: ${TARGET_APP_ID}`);
  console.log(`   🌍 Country: ${TARGET_COUNTRY}`);
  console.log(`   🌏 Language: ${TARGET_LANGUAGE}`);
  
  // Test the main endpoint
  const endpointUrl = `${server.url}/app?appid=${TARGET_APP_ID}&country=${TARGET_COUNTRY}&lang=${TARGET_LANGUAGE}&num=10`;
  console.log(`   🔗 Endpoint: ${endpointUrl}`);
  
  try {
    const startTime = Date.now();
    const response = await makeRequest(endpointUrl);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`   ✅ Status: ${response.statusCode}`);
    console.log(`   ⏱️  Response Time: ${responseTime}ms`);
    console.log(`   📊 Response Size: ${response.rawData.length} bytes`);
    
    if (response.statusCode === 200 && response.data) {
      if (response.data.success) {
        const reviews = response.data.data?.data || [];
        console.log(`   📝 Reviews Found: ${reviews.length}`);
        
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
          
          // Performance analysis
          if (responseTime > 10000) {
            console.log(`   ⚠️  Response time is slow: ${responseTime}ms`);
          } else if (responseTime > 5000) {
            console.log(`   📈 Response time is moderate: ${responseTime}ms`);
          } else {
            console.log(`   🚀 Response time is excellent: ${responseTime}ms`);
          }
        } else {
          console.log(`   ⚠️  No reviews found - this might be normal for some apps/countries`);
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

// Test health endpoint
async function testHealthEndpoint(server) {
  console.log(`\n🔍 Testing Health: ${server.name}`);
  
  try {
    const response = await makeRequest(`${server.url}/health`);
    console.log(`   ✅ Health Status: ${response.statusCode}`);
    
    if (response.statusCode === 200 && response.data) {
      console.log(`   📊 Health Data: ${JSON.stringify(response.data, null, 2)}`);
    }
    
    return { success: true, response };
  } catch (error) {
    console.log(`   ❌ Health check failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Google Reviews API Endpoint Tests');
  console.log('=' .repeat(60));
  console.log(`🎯 Target Endpoint: ${TARGET_COUNTRY}&appid=${TARGET_APP_ID}`);
  console.log('=' .repeat(60));
  
  const results = [];
  
  for (const server of TEST_SERVERS) {
    console.log(`\n🌐 Testing Server: ${server.name}`);
    console.log(`   URL: ${server.url}`);
    console.log('-'.repeat(40));
    
    // Test health first
    const healthResult = await testHealthEndpoint(server);
    
    // Test the specific endpoint
    const endpointResult = await testSpecificEndpoint(server);
    
    results.push({
      server: server.name,
      url: server.url,
      health: healthResult,
      endpoint: endpointResult
    });
    
    // Add delay between servers
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Generate test summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  results.forEach(result => {
    console.log(`\n🌐 ${result.server}`);
    console.log(`   URL: ${result.url}`);
    
    const healthStatus = result.health.success ? '✅ PASS' : '❌ FAIL';
    const endpointStatus = result.endpoint.success ? '✅ PASS' : '❌ FAIL';
    
    console.log(`   🔍 Health: ${healthStatus}`);
    console.log(`   🎯 Endpoint: ${endpointStatus}`);
    
    if (result.endpoint.responseTime) {
      console.log(`   ⏱️  Response Time: ${result.endpoint.responseTime}ms`);
    }
  });
  
  console.log('\n🎯 Primary Endpoint Test Results:');
  console.log('   This tested the specific endpoint you requested:');
  console.log(`   📱 App ID: ${TARGET_APP_ID}`);
  console.log(`   🌍 Country: ${TARGET_COUNTRY}`);
  console.log(`   🌏 Language: ${TARGET_LANGUAGE}`);
  
  console.log('\n✅ Testing completed!');
}

// Run the tests
runTests().catch(error => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});
