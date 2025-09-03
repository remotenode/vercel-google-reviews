// Test script to show complete JSON response with individual thumbs up/down fields
console.log('🚀 Complete Enhanced API Response with Individual Fields');
console.log('=' .repeat(60));

// Simulate what the enhanced API would return with individual fields
const enhancedReviews = [
  {
    id: "13ca186d-d888-4bcd-8604-9346a4f24544",
    userName: "Zarina Begum",
    userImage: "https://play-lh.googleusercontent.com/a-/ALV-UjXfKIxiS89jSFsgjwO1c3ostVgAcLkcfSDx6JYe8HoE2HzvX0E4",
    date: "2025-09-02T10:40:31.533Z",
    score: 5,
    scoreText: "5",
    url: "https://play.google.com/store/apps/details?id=com.iqoption&reviewId=13ca186d-d888-4bcd-8604-9346a4f24544",
    title: "Great app experience",
    text: "good option",
    replyDate: "2025-09-02T18:09:53.640Z",
    replyText: "Thank you for your feedback!",
    version: "8.62.0",
    // Individual thumbs up/down fields
    thumbsUp: 12,
    likes: 15,
    helpful: 8,
    positive: 12,
    thumbsDown: null,
    dislikes: null,
    unhelpful: null,
    negative: null,
    criterias: ["usability", "performance"]
  },
  {
    id: "minimal-review-123",
    userName: "John Doe",
    userImage: null,
    date: "2025-09-03T19:27:45.323Z",
    score: 4,
    scoreText: "4",
    url: "https://play.google.com/store/apps/details?id=com.iqoption&reviewId=minimal-review-123",
    title: null,
    text: "Works fine",
    replyDate: null,
    replyText: null,
    version: "8.61.0",
    // Individual thumbs up/down fields
    thumbsUp: null,
    likes: null,
    helpful: null,
    positive: null,
    thumbsDown: 2,
    dislikes: 2,
    unhelpful: 1,
    negative: null,
    criterias: []
  }
];

console.log('📊 Complete Enhanced API Response:');
console.log(JSON.stringify({ data: enhancedReviews }, null, 2));

console.log('\n🎯 Individual Field Extraction Benefits:');
console.log('✅ thumbsUp: Direct thumbs up count from Google Play');
console.log('✅ likes: Separate likes count if available');
console.log('✅ helpful: Helpful marks count if available');
console.log('✅ positive: Positive feedback count if available');
console.log('✅ thumbsDown: Direct thumbs down count if available');
console.log('✅ dislikes: Separate dislikes count if available');
console.log('✅ unhelpful: Unhelpful marks count if available');
console.log('✅ negative: Negative feedback count if available');

console.log('\n📈 Data Granularity:');
console.log('• Each field is extracted individually, not combined');
console.log('• You get the exact data structure from Google Play Store');
console.log('• More flexibility for analytics and filtering');
console.log('• Better understanding of user engagement patterns');
