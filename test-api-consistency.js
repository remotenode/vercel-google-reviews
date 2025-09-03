import https from 'https';
import fs from 'fs';
import crypto from 'crypto';

// Configuration
const ENDPOINT_URL = 'https://vercel-app-nine-dusky.vercel.app/api/app?country=vn&appid=com.iqoption';
const NUM_REQUESTS = 10;
const OUTPUT_DIR = './api-test-results';

// Utility function to make HTTPS request
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        const req = https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: jsonData,
                        responseTime,
                        rawData: data
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: null,
                        responseTime,
                        rawData: data,
                        parseError: error.message
                    });
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.setTimeout(30000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

// Function to calculate hash of response data
function calculateHash(data) {
    return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
}

// Function to compare two responses
function compareResponses(response1, response2) {
    const differences = {
        statusCode: response1.statusCode !== response2.statusCode,
        dataLength: response1.data?.data?.length !== response2.data?.data?.length,
        hash: calculateHash(response1.data) !== calculateHash(response2.data),
        responseTime: Math.abs(response1.responseTime - response2.responseTime),
        structure: false
    };
    
    // Check structure differences
    if (response1.data && response2.data) {
        const keys1 = Object.keys(response1.data);
        const keys2 = Object.keys(response2.data);
        differences.structure = keys1.length !== keys2.length || 
                              !keys1.every(key => keys2.includes(key));
    }
    
    return differences;
}

// Function to analyze review data consistency
function analyzeReviewData(responses) {
    const allReviews = responses.map(resp => resp.data?.data || []);
    const validResponses = allReviews.filter(reviews => reviews.length > 0);
    
    if (validResponses.length === 0) {
        return { error: 'No valid review data found' };
    }
    
    // Check if all responses have the same number of reviews
    const reviewCounts = validResponses.map(reviews => reviews.length);
    const uniqueCounts = [...new Set(reviewCounts)];
    
    // Check if reviews are identical across responses
    const firstResponse = validResponses[0];
    const allIdentical = validResponses.every(reviews => 
        reviews.length === firstResponse.length &&
        reviews.every((review, index) => 
            review.id === firstResponse[index].id &&
            review.userName === firstResponse[index].userName &&
            review.text === firstResponse[index].text &&
            review.score === firstResponse[index].score
        )
    );
    
    // Check if reviews are just reordered
    const firstIds = firstResponse.map(r => r.id).sort();
    const reordered = validResponses.every(reviews => {
        const sortedIds = reviews.map(r => r.id).sort();
        return sortedIds.length === firstIds.length &&
               sortedIds.every((id, index) => id === firstIds[index]);
    });
    
    // Analyze review IDs across responses
    const allIds = validResponses.flatMap(reviews => reviews.map(r => r.id));
    const uniqueIds = [...new Set(allIds)];
    const idFrequency = {};
    allIds.forEach(id => {
        idFrequency[id] = (idFrequency[id] || 0) + 1;
    });
    
    return {
        totalResponses: responses.length,
        validResponses: validResponses.length,
        reviewCounts,
        uniqueReviewCounts: uniqueCounts,
        allIdentical,
        reordered,
        totalUniqueReviews: uniqueIds.length,
        idFrequency,
        averageReviewsPerResponse: validResponses.reduce((sum, reviews) => sum + reviews.length, 0) / validResponses.length
    };
}

// Function to save responses to files
function saveResponses(responses) {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    responses.forEach((response, index) => {
        const filename = `${OUTPUT_DIR}/response_${index + 1}.json`;
        fs.writeFileSync(filename, JSON.stringify(response, null, 2));
        console.log(`✅ Saved response ${index + 1} to ${filename}`);
    });
    
    // Save summary
    const summary = {
        timestamp: new Date().toISOString(),
        endpoint: ENDPOINT_URL,
        totalRequests: responses.length,
        successfulRequests: responses.filter(r => r.statusCode === 200).length,
        failedRequests: responses.filter(r => r.statusCode !== 200).length,
        averageResponseTime: responses.reduce((sum, r) => sum + r.responseTime, 0) / responses.length,
        responseTimes: responses.map(r => r.responseTime),
        statusCodes: responses.map(r => r.statusCode)
    };
    
    fs.writeFileSync(`${OUTPUT_DIR}/summary.json`, JSON.stringify(summary, null, 2));
    console.log(`✅ Saved summary to ${OUTPUT_DIR}/summary.json`);
}

// Main testing function
async function testAPIConsistency() {
    console.log('🚀 Starting API Consistency Test');
    console.log(`📡 Testing endpoint: ${ENDPOINT_URL}`);
    console.log(`🔄 Making ${NUM_REQUESTS} requests...\n`);
    
    const responses = [];
    const startTime = Date.now();
    
    try {
        // Make multiple requests
        for (let i = 0; i < NUM_REQUESTS; i++) {
            console.log(`📤 Making request ${i + 1}/${NUM_REQUESTS}...`);
            
            try {
                const response = await makeRequest(ENDPOINT_URL);
                responses.push(response);
                
                console.log(`✅ Request ${i + 1} completed:`);
                console.log(`   Status: ${response.statusCode}`);
                console.log(`   Response time: ${response.responseTime}ms`);
                console.log(`   Data length: ${response.data?.data?.length || 0} reviews`);
                
                if (response.parseError) {
                    console.log(`   ⚠️  Parse error: ${response.parseError}`);
                }
                
                console.log('');
                
                // Small delay between requests to avoid rate limiting
                if (i < NUM_REQUESTS - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                
            } catch (error) {
                console.log(`❌ Request ${i + 1} failed: ${error.message}`);
                responses.push({
                    statusCode: 0,
                    data: null,
                    responseTime: 0,
                    error: error.message
                });
            }
        }
        
        const totalTime = Date.now() - startTime;
        console.log(`⏱️  All requests completed in ${totalTime}ms\n`);
        
        // Analyze responses
        console.log('🔍 Analyzing response consistency...\n');
        
        // Basic statistics
        const successfulResponses = responses.filter(r => r.statusCode === 200);
        const failedResponses = responses.filter(r => r.statusCode !== 200);
        
        console.log('📊 Basic Statistics:');
        console.log(`   Total requests: ${responses.length}`);
        console.log(`   Successful: ${successfulResponses.length}`);
        console.log(`   Failed: ${failedResponses.length}`);
        console.log(`   Success rate: ${((successfulResponses.length / responses.length) * 100).toFixed(1)}%`);
        
        if (successfulResponses.length > 0) {
            const avgResponseTime = successfulResponses.reduce((sum, r) => sum + r.responseTime, 0) / successfulResponses.length;
            console.log(`   Average response time: ${avgResponseTime.toFixed(2)}ms`);
            
            const responseTimes = successfulResponses.map(r => r.responseTime);
            const minTime = Math.min(...responseTimes);
            const maxTime = Math.max(...responseTimes);
            console.log(`   Response time range: ${minTime}ms - ${maxTime}ms`);
        }
        
        console.log('');
        
        // Consistency analysis
        if (successfulResponses.length > 1) {
            console.log('🔍 Consistency Analysis:');
            
            // Compare first two successful responses
            const firstResponse = successfulResponses[0];
            const secondResponse = successfulResponses[1];
            const differences = compareResponses(firstResponse, secondResponse);
            
            console.log(`   Comparing responses 1 and 2:`);
            console.log(`   Status codes identical: ${!differences.statusCode}`);
            console.log(`   Data length identical: ${!differences.dataLength}`);
            console.log(`   Content identical: ${!differences.hash}`);
            console.log(`   Structure identical: ${!differences.structure}`);
            console.log(`   Response time difference: ${differences.responseTime}ms`);
            
            console.log('');
            
            // Detailed review analysis
            console.log('📝 Review Data Analysis:');
            const reviewAnalysis = analyzeReviewData(successfulResponses);
            
            if (reviewAnalysis.error) {
                console.log(`   ❌ ${reviewAnalysis.error}`);
            } else {
                console.log(`   Total responses analyzed: ${reviewAnalysis.totalResponses}`);
                console.log(`   Valid responses: ${reviewAnalysis.validResponses}`);
                console.log(`   Review counts: [${reviewAnalysis.reviewCounts.join(', ')}]`);
                console.log(`   Unique review counts: [${reviewAnalysis.uniqueReviewCounts.join(', ')}]`);
                console.log(`   All responses identical: ${reviewAnalysis.allIdentical}`);
                console.log(`   Reviews just reordered: ${reviewAnalysis.reordered}`);
                console.log(`   Total unique reviews across all responses: ${reviewAnalysis.totalUniqueReviews}`);
                console.log(`   Average reviews per response: ${reviewAnalysis.averageReviewsPerResponse.toFixed(1)}`);
                
                if (!reviewAnalysis.allIdentical) {
                    console.log('\n   📋 Review ID Frequency Analysis:');
                    const sortedIds = Object.entries(reviewAnalysis.idFrequency)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 10);
                    
                    sortedIds.forEach(([id, count]) => {
                        console.log(`      ID ${id}: appears in ${count}/${reviewAnalysis.validResponses} responses`);
                    });
                }
            }
            
            console.log('');
            
            // Save detailed responses for manual inspection
            console.log('💾 Saving responses to files...');
            saveResponses(responses);
            
        } else if (successfulResponses.length === 1) {
            console.log('⚠️  Only one successful response - cannot perform consistency analysis');
        } else {
            console.log('❌ No successful responses - cannot perform consistency analysis');
        }
        
        // Summary and conclusions
        console.log('📋 Summary and Conclusions:');
        
        if (successfulResponses.length === 0) {
            console.log('   ❌ API endpoint is not responding successfully');
        } else if (successfulResponses.length === 1) {
            console.log('   ⚠️  Only one successful response - need more data for consistency analysis');
        } else {
            const firstResponse = successfulResponses[0];
            const secondResponse = successfulResponses[1];
            const differences = compareResponses(firstResponse, secondResponse);
            
            if (differences.hash) {
                if (differences.dataLength) {
                    console.log('   🔄 API returns different amounts of data across requests');
                } else if (differences.structure) {
                    console.log('   🔄 API returns different data structures across requests');
                } else {
                    console.log('   🔄 API returns same data structure but different content across requests');
                }
                console.log('   💡 This suggests the API may be returning real-time or dynamic data');
            } else {
                console.log('   ✅ API returns consistent data across all requests');
                console.log('   💡 This suggests the API may be using cached or static data');
            }
        }
        
    } catch (error) {
        console.error('❌ Test failed with error:', error);
    }
}

// Run the test
testAPIConsistency().catch(console.error);
