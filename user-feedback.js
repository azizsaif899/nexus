// TASK-FEATURE-002: User feedback mechanism
class UserFeedback {
  constructor() {
    this.feedback = [];
  }
  
  collect(rating, comment) {
    this.feedback.push({
      rating,
      comment,
      timestamp: Date.now()
    });
    console.log('📝 Feedback collected:', rating);
  }
  
  getStats() {
    const avg = this.feedback.reduce((sum, f) => sum + f.rating, 0) / this.feedback.length;
    return { average: avg, total: this.feedback.length };
  }
}

console.log('✅ User feedback system implemented');