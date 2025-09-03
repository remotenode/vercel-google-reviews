const https = require('https');

const TEST_URL = 'https://android.reviews.aso.market/?appid=com.iqoption&country=vn&date=2025-01-01';
const NUM_REQUESTS = 10;

// Store all responses for analysis
const responses = [];
const responseTimes = [];

// Function to make HTTP request
function makeRequest(requestNumber) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    https.get(TEST_URL, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        try {
          const jsonData = JSON.parse(data);
          const response = {
            requestNumber,
            statusCode: res.statusCode,
            responseTime,
            data: jsonData,
            timestamp: new Date().toISOString()
          };
          
          responses.push(response);
          responseTimes.push(responseTime);
          
          console.log(`✅ Request ${requestNumber}: Status ${res.statusCode}, Time ${responseTime}ms, Reviews: ${jsonData.data ? jsonData.data.length : 0}`);
          resolve(response);
          
        } catch (parseError) {
          console.error(`❌ Request ${requestNumber}: Failed to parse JSON - ${parseError.message}`);
          reject(parseError);
        }
      });
    }).on('error', (error) => {
      console.error(`❌ Request ${requestNumber}: HTTP Error - ${error.message}`);
      reject(error);
    });
  });
}

// Function to analyze consistency
function analyzeConsistency() {
  console.log('\n🔍 CONSISTENCY ANALYSIS');
  console.log('=' .repeat(50));
  
  if (responses.length === 0) {
    console.log('❌ No successful responses to analyze');
    return;
  }
  
  // Check if all responses have the same status code
  const statusCodes = responses.map(r => r.statusCode);
  const uniqueStatusCodes = [...new Set(statusCodes)];
  console.log(`📊 Status Codes: ${uniqueStatusCodes.length === 1 ? '✅ CONSISTENT' : '❌ INCONSISTENT'}`);
  console.log(`   All responses: ${statusCodes.join(', ')}`);
  
  // Check if all responses have the same number of reviews
  const reviewCounts = responses.map(r => r.data?.data?.length || 0);
  const uniqueReviewCounts = [...new Set(reviewCounts)];
  console.log(`📊 Review Counts: ${uniqueReviewCounts.length === 1 ? '✅ CONSISTENT' : '❌ INCONSISTENT'}`);
  console.log(`   All responses: ${reviewCounts.join(', ')}`);
  
  // Check if review content is identical
  const firstResponse = responses[0];
  let contentIdentical = true;
  let contentAnalysis = [];
  
  for (let i = 1; i < responses.length; i++) {
    const currentResponse = responses[i];
    const firstReviews = firstResponse.data?.data || [];
    const currentReviews = currentResponse.data?.data || [];
    
    if (firstReviews.length !== currentReviews.length) {
      contentIdentical = false;
      contentAnalysis.push(`Request ${i + 1}: Different review count (${firstReviews.length} vs ${currentReviews.length})`);
      continue;
    }
    
    // Compare first few reviews for content similarity
    const firstReview = firstReviews[0];
    const currentReview = currentReviews[0];
    
    if (!firstReview || !currentReview) {
      contentAnalysis.push(`Request ${i + 1}: Missing review data`);
      continue;
    }
    
    // Check if first review has same content
    if (firstReview.userName !== currentReview.userName || 
        firstReview.text !== currentReview.text ||
        firstReview.score !== currentReview.score) {
      contentIdentical = false;
      contentAnalysis.push(`Request ${i + 1}: Different first review content`);
    }
  }
  
  console.log(`📊 Content Consistency: ${contentIdentical ? '✅ IDENTICAL' : '❌ DIFFERENT'}`);
  if (!contentIdentical) {
    console.log('   Differences found:');
    contentAnalysis.forEach(diff => console.log(`   - ${diff}`));
  }
  
  // Response time analysis
  const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  const minResponseTime = Math.min(...responseTimes);
  const maxResponseTime = Math.max(...responseTimes);
  const responseTimeVariance = responseTimes.reduce((sum, time) => sum + Math.pow(time - avgResponseTime, 2), 0) / responseTimes.length;
  
  console.log(`📊 Response Times:`);
  console.log(`   Average: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`   Min: ${minResponseTime}ms`);
  console.log(`   Max: ${maxResponseTime}ms`);
  console.log(`   Variance: ${responseTimeVariance.toFixed(2)}ms²`);
  
  // Check for any errors
  const errors = responses.filter(r => r.statusCode !== 200);
  if (errors.length > 0) {
    console.log(`❌ Errors found: ${errors.length} requests failed`);
    errors.forEach(error => {
      console.log(`   Request ${error.requestNumber}: Status ${error.statusCode}`);
    });
  }
  
  // Summary
  console.log('\n📋 SUMMARY');
  console.log('=' .repeat(50));
  console.log(`Total Requests: ${NUM_REQUESTS}`);
  console.log(`Successful: ${responses.length}`);
  console.log(`Failed: ${NUM_REQUESTS - responses.length}`);
  console.log(`Status Consistency: ${uniqueStatusCodes.length === 1 ? '✅' : '❌'}`);
  console.log(`Content Consistency: ${contentIdentical ? '✅' : '❌'}`);
  console.log(`Response Time Stability: ${responseTimeVariance < 1000 ? '✅' : '❌'}`);
  
  // Save detailed results to file
  const fs = require('fs');
  const results = {
    testUrl: TEST_URL,
    timestamp: new Date().toISOString(),
    totalRequests: NUM_REQUESTS,
    successfulRequests: responses.length,
    consistency: {
      statusCodes: uniqueStatusCodes.length === 1,
      reviewCounts: uniqueReviewCounts.length === 1,
      content: contentIdentical,
      responseTimes: responseTimeVariance < 1000
    },
    responses: responses.map(r => ({
      requestNumber: r.requestNumber,
      statusCode: r.statusCode,
      responseTime: r.responseTime,
      reviewCount: r.data?.data?.length || 0,
      timestamp: r.timestamp
    }))
  };
  
  fs.writeFileSync('date-filter-consistency-results.json', JSON.stringify(results, null, 2));
  console.log('\n💾 Detailed results saved to: date-filter-consistency-results.json');
}

// Main execution
async function runConsistencyTest() {
  console.log(`🚀 Starting Consistency Test for Date Filter Endpoint`);
  console.log(`📡 URL: ${TEST_URL}`);
  console.log(`🔢 Number of requests: ${NUM_REQUESTS}`);
  console.log('=' .repeat(60));
  
  const promises = [];
  
  // Make all requests concurrently
  for (let i = 1; i <= NUM_REQUESTS; i++) {
    promises.push(makeRequest(i));
  }
  
  try {
    await Promise.all(promises);
    console.log('\n✅ All requests completed!');
    analyzeConsistency();
  } catch (error) {
    console.error('\n❌ Some requests failed:', error.message);
    analyzeConsistency();
  }
}

// Run the test
runConsistencyTest();
