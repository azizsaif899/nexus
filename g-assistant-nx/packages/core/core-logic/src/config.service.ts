import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private geminiReviewerConfig = {
    prompts: {
      default: 'Analyze the following code for issues.',
      update: 'Review the following code for an update request.',
      fix: 'Analyze the following code for a fix request.'
    },
    modelSettings: {
      temperature: 0.5,
      maxTokens: 1024
    }
  };

  getGeminiReviewerConfig() {
    return this.geminiReviewerConfig;
  }
}
