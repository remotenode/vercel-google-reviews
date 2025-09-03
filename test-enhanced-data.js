// Test script to demonstrate enhanced data extraction
// This simulates what the enhanced API would return

const sampleReviews = [
  {
    // Sample with enhanced data available
    reviewId: "13ca186d-d888-4bcd-8604-9346a4f24544",
    userName: "Zarina Begum",
    userImage: "https://play-lh.googleusercontent.com/a-/ALV-UjXfKIxiS89jSFsgjwO1c3ostVgAcLkcfSDx6JYe8HoE2HzvX0E4",
    date: "2025-09-02T10:40:31.533Z",
    score: 5,
    title: "Great app experience",
    text: "good option",
    replyDate: "2025-09-02T18:09:53.640Z",
    replyText: "Thank you for your feedback!",
    appVersion: "8.62.0",
    thumbsUp: 12,
    likes: 15,
    helpful: 8,
    positive: 12,
    criterias: ["usability", "performance"]
  },
  {
    // Sample with minimal data
    id: "minimal-review-123",
    author: "John Doe",
    rating: 4,
    body: "Works fine",
    app_version: "8.61.0",
    thumbsDown: 2,
    dislikes: 2,
    unhelpful: 1
  },
  {
    // Sample with mixed data
    reviewId: "mixed-data-456",
    userName: "Jane Smith",
    profileImage: "https://example.com/profile.jpg",
    time: "2025-09-01T15:30:00.000Z",
    stars: 3,
    headline: "Could be better",
    content: "The app has potential but needs improvements",
    version: "8.60.0",
    likes: 5,
    tags: ["interface", "features"]
  }
];

// Enhanced transformation function (same logic as in app.ts)
function transformReviews(reviews, appId) {
  return reviews.map((review, index) => {
    // Try to get real review ID first, fallback to generated ID
    const realReviewId = review.reviewId || review.id;
    const uniqueId = realReviewId || `gp-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Construct Google Play Store URL with real review ID when available
    const url = `https://play.google.com/store/apps/details?id=${appId}&reviewId=${realReviewId || uniqueId}`;
    
    // Enhanced data extraction with fallbacks
    return {
      id: uniqueId,
      userName: review.userName || review.author || 'Anonymous User',
      userImage: review.userImage || review.profileImage || null,
      date: review.date || review.time || review.timestamp || new Date().toISOString(),
      score: review.score || review.rating || review.stars || 3,
      scoreText: String(review.score || review.rating || review.stars || 3),
      url: url,
      title: review.title || review.headline || null,
      text: review.text || review.body || review.content || review.comment || 'No review text available',
      replyDate: review.replyDate || review.reply?.date || review.replyDate || null,
      replyText: review.replyText || review.reply?.text || review.replyText || null,
      version: review.appVersion || review.version || review.app_version || 'Unknown',
                  thumbsUp: review.thumbsUp || null,
            likes: review.likes || null,
            helpful: review.helpful || null,
            positive: review.positive || null,
            thumbsDown: review.thumbsDown || null,
            dislikes: review.dislikes || null,
            unhelpful: review.unhelpful || null,
            negative: review.negative || null,
      criterias: review.criterias || review.criteria || review.tags || []
    };
  });
}

// Test the enhanced transformation
console.log('🚀 Testing Enhanced Data Extraction');
console.log('=' .repeat(50));

const transformedReviews = transformReviews(sampleReviews, 'com.iqoption');

console.log('\n📊 Enhanced Data Extraction Results:');
console.log('=' .repeat(50));

transformedReviews.forEach((review, index) => {
  console.log(`\n🔍 Review ${index + 1}:`);
  console.log(`   ID: ${review.id}`);
  console.log(`   User: ${review.userName}`);
  console.log(`   User Image: ${review.userImage ? '✅ Available' : '❌ Not available'}`);
  console.log(`   Date: ${review.date}`);
  console.log(`   Score: ${review.score}/5`);
  console.log(`   Title: ${review.title ? `"${review.title}"` : '❌ Not available'}`);
  console.log(`   Text: "${review.text}"`);
  console.log(`   Reply Date: ${review.replyDate ? review.replyDate : '❌ Not available'}`);
  console.log(`   Reply Text: ${review.replyText ? `"${review.replyText}"` : '❌ Not available'}`);
  console.log(`   Version: ${review.version}`);
     console.log(`   Thumbs Up: ${review.thumbsUp ? review.thumbsUp : '❌ Not available'}`);
   console.log(`   Likes: ${review.likes ? review.likes : '❌ Not available'}`);
   console.log(`   Helpful: ${review.helpful ? review.helpful : '❌ Not available'}`);
   console.log(`   Positive: ${review.positive ? review.positive : '❌ Not available'}`);
   console.log(`   Thumbs Down: ${review.thumbsDown ? review.thumbsDown : '❌ Not available'}`);
   console.log(`   Dislikes: ${review.dislikes ? review.dislikes : '❌ Not available'}`);
   console.log(`   Unhelpful: ${review.unhelpful ? review.unhelpful : '❌ Not available'}`);
   console.log(`   Negative: ${review.negative ? review.negative : '❌ Not available'}`);
  console.log(`   Criteria: ${review.criterias.length > 0 ? review.criterias.join(', ') : '❌ Not available'}`);
  console.log(`   URL: ${review.url}`);
});

// Summary statistics
const summary = {
  totalReviews: transformedReviews.length,
  withRealIds: transformedReviews.filter(r => !r.id.startsWith('gp-')).length,
  withUserImages: transformedReviews.filter(r => r.userImage !== null).length,
  withTitles: transformedReviews.filter(r => r.title !== null).length,
  withReplyData: transformedReviews.filter(r => r.replyDate !== null || r.replyText !== null).length,
  withThumbsUp: transformedReviews.filter(r => r.thumbsUp !== null).length,
  withCriteria: transformedReviews.filter(r => r.criterias.length > 0).length,
  withBetterVersions: transformedReviews.filter(r => r.version !== 'Unknown').length
};

console.log('\n📈 ENHANCED DATA SUMMARY');
console.log('=' .repeat(50));
console.log(`Total Reviews: ${summary.totalReviews}`);
console.log(`With Real IDs: ${summary.withRealIds}/${summary.totalReviews} (${((summary.withRealIds/summary.totalReviews)*100).toFixed(1)}%)`);
console.log(`With User Images: ${summary.withUserImages}/${summary.totalReviews} (${((summary.withUserImages/summary.totalReviews)*100).toFixed(1)}%)`);
console.log(`With Titles: ${summary.withTitles}/${summary.totalReviews} (${((summary.withTitles/summary.totalReviews)*100).toFixed(1)}%)`);
console.log(`With Reply Data: ${summary.withReplyData}/${summary.totalReviews} (${((summary.withReplyData/summary.totalReviews)*100).toFixed(1)}%)`);
console.log(`With Thumbs Up: ${summary.withThumbsUp}/${summary.totalReviews} (${((summary.withThumbsUp/summary.totalReviews)*100).toFixed(1)}%)`);
console.log(`With Criteria: ${summary.withCriteria}/${summary.totalReviews} (${((summary.withCriteria/summary.totalReviews)*100).toFixed(1)}%)`);
console.log(`With Better Versions: ${summary.withBetterVersions}/${summary.totalReviews} (${((summary.withBetterVersions/summary.totalReviews)*100).toFixed(1)}%)`);

console.log('\n🎯 Key Improvements:');
console.log('✅ Better ID generation (uses real reviewId when available)');
console.log('✅ Enhanced user image detection');
console.log('✅ Title extraction from multiple fields');
console.log('✅ Reply data extraction');
console.log('✅ Better version detection');
console.log('✅ Thumbs up count extraction');
console.log('✅ Criteria/tags extraction');
console.log('✅ More comprehensive text field mapping');
