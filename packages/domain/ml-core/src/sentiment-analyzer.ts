import { Injectable } from '@nestjs/common';

@Injectable()
export class SentimentAnalyzer {
  private positiveWords = ['ممتاز', 'رائع', 'جيد', 'أحب', 'سعيد'];
  private negativeWords = ['سيء', 'فظيع', 'أكره', 'حزين', 'غاضب'];

  async analyzeSentiment(text: string): Promise<any> {
    const tokens = this.tokenize(text);
    const scores = this.calculateScores(tokens);
    
    return {
      sentiment: this.classifySentiment(scores.compound),
      scores: {
        positive: scores.positive,
        negative: scores.negative,
        neutral: scores.neutral,
        compound: scores.compound
      },
      confidence: Math.abs(scores.compound)
    };
  }

  async batchAnalyze(texts: string[]): Promise<any[]> {
    return Promise.all(texts.map(text => this.analyzeSentiment(text)));
  }

  async getEmotions(text: string): Promise<any> {
    // Emotion detection beyond sentiment
    const emotions = {
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      surprise: 0,
      disgust: 0
    };

    const tokens = this.tokenize(text);
    
    // Simple emotion detection based on keywords
    tokens.forEach(token => {
      if (['سعيد', 'فرح', 'مبسوط'].includes(token)) emotions.joy += 0.3;
      if (['حزين', 'مكتئب', 'زعلان'].includes(token)) emotions.sadness += 0.3;
      if (['غاضب', 'زعلان', 'متضايق'].includes(token)) emotions.anger += 0.3;
    });

    return emotions;
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\u0600-\u06FF\s]/g, '') // Keep only Arabic characters and spaces
      .split(/\s+/)
      .filter(token => token.length > 0);
  }

  private calculateScores(tokens: string[]): any {
    let positive = 0;
    let negative = 0;
    let neutral = 0;

    tokens.forEach(token => {
      if (this.positiveWords.includes(token)) {
        positive += 1;
      } else if (this.negativeWords.includes(token)) {
        negative += 1;
      } else {
        neutral += 1;
      }
    });

    const total = positive + negative + neutral;
    const compound = total > 0 ? (positive - negative) / total : 0;

    return {
      positive: total > 0 ? positive / total : 0,
      negative: total > 0 ? negative / total : 0,
      neutral: total > 0 ? neutral / total : 0,
      compound
    };
  }

  private classifySentiment(compound: number): string {
    if (compound >= 0.05) return 'positive';
    if (compound <= -0.05) return 'negative';
    return 'neutral';
  }
}