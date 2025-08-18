
import { Injectable } from '@nestjs/common';

@Injectable()
export class FeedbackService {
  async submitFeedback(feedback: { rating: number; comment: string; conversationId: string }) {
    // Logic to store feedback in the database
    console.log('Feedback submitted:', feedback);
    return { success: true };
  }
}
