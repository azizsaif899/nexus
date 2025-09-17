export interface NLPResult {
  text: string;
  language: string;
  sentiment: {
    label: 'positive' | 'negative' | 'neutral';
    score: number;
  };
  entities: Array<{
    text: string;
    type: string;
    confidence: number;
    start: number;
    end: number;
  }>;
  keywords: string[];
  summary?: string;
  intent?: {
    name: string;
    confidence: number;
  };
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
}

export class NLPProcessor {
  private supportedLanguages = ['ar', 'en', 'fr', 'es', 'de'];
  private entityTypes = ['PERSON', 'ORGANIZATION', 'LOCATION', 'DATE', 'MONEY', 'EMAIL', 'PHONE'];

  async processText(text: string, language = 'auto'): Promise<NLPResult> {
    const detectedLanguage = language === 'auto' ? this.detectLanguage(text) : language;
    
    return {
      text,
      language: detectedLanguage,
      sentiment: this.analyzeSentiment(text),
      entities: this.extractEntities(text),
      keywords: this.extractKeywords(text),
      summary: this.generateSummary(text),
      intent: this.detectIntent(text)
    };
  }

  private detectLanguage(text: string): string {
    // Simple language detection based on character patterns
    const arabicPattern = /[\u0600-\u06FF]/;
    const englishPattern = /[a-zA-Z]/;
    
    if (arabicPattern.test(text)) return 'ar';
    if (englishPattern.test(text)) return 'en';
    
    return 'en'; // default
  }

  private analyzeSentiment(text: string): { label: 'positive' | 'negative' | 'neutral'; score: number } {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'جيد', 'ممتاز', 'رائع'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'سيء', 'فظيع', 'مروع'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
      if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
    });
    
    let label: 'positive' | 'negative' | 'neutral';
    let score: number;
    
    if (positiveCount > negativeCount) {
      label = 'positive';
      score = 0.6 + (positiveCount / words.length) * 0.4;
    } else if (negativeCount > positiveCount) {
      label = 'negative';
      score = 0.6 + (negativeCount / words.length) * 0.4;
    } else {
      label = 'neutral';
      score = 0.5 + Math.random() * 0.2;
    }
    
    return { label, score: Math.min(score, 1.0) };
  }

  private extractEntities(text: string): Array<{
    text: string;
    type: string;
    confidence: number;
    start: number;
    end: number;
  }> {
    const entities = [];
    
    // Email detection
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    let match;
    while ((match = emailRegex.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: 'EMAIL',
        confidence: 0.95,
        start: match.index,
        end: match.index + match[0].length
      });
    }
    
    // Phone detection
    const phoneRegex = /\b\d{3}-\d{3}-\d{4}\b|\b\d{10}\b/g;
    while ((match = phoneRegex.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: 'PHONE',
        confidence: 0.9,
        start: match.index,
        end: match.index + match[0].length
      });
    }
    
    // Date detection (simple)
    const dateRegex = /\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\d{4}-\d{2}-\d{2}\b/g;
    while ((match = dateRegex.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: 'DATE',
        confidence: 0.85,
        start: match.index,
        end: match.index + match[0].length
      });
    }
    
    // Money detection
    const moneyRegex = /\$\d+(?:,\d{3})*(?:\.\d{2})?|\d+(?:,\d{3})*(?:\.\d{2})?\s*(?:dollar|USD|ريال|جنيه)/gi;
    while ((match = moneyRegex.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: 'MONEY',
        confidence: 0.8,
        start: match.index,
        end: match.index + match[0].length
      });
    }
    
    return entities;
  }

  private extractKeywords(text: string): string[] {
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'من', 'إلى', 'في', 'على', 'مع', 'هذا', 'هذه'];
    
    const words = text.toLowerCase()
      .replace(/[^\w\s\u0600-\u06FF]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));
    
    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });
    
    return Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  private generateSummary(text: string): string {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length <= 2) return text;
    
    // Simple extractive summarization - take first and most important sentences
    const summary = sentences.slice(0, Math.min(2, Math.ceil(sentences.length / 3)));
    
    return summary.join('. ').trim() + '.';
  }

  private detectIntent(text: string): { name: string; confidence: number } {
    const intents = [
      { name: 'question', patterns: ['what', 'how', 'when', 'where', 'why', 'who', 'ما', 'كيف', 'متى', 'أين', 'لماذا', 'من'] },
      { name: 'request', patterns: ['please', 'can you', 'could you', 'would you', 'من فضلك', 'هل يمكن', 'أريد'] },
      { name: 'complaint', patterns: ['problem', 'issue', 'error', 'wrong', 'مشكلة', 'خطأ', 'عطل'] },
      { name: 'greeting', patterns: ['hello', 'hi', 'good morning', 'مرحبا', 'أهلا', 'السلام عليكم'] },
      { name: 'goodbye', patterns: ['bye', 'goodbye', 'see you', 'مع السلامة', 'وداعا'] }
    ];
    
    const lowerText = text.toLowerCase();
    let bestMatch = { name: 'unknown', confidence: 0 };
    
    for (const intent of intents) {
      const matches = intent.patterns.filter(pattern => lowerText.includes(pattern)).length;
      const confidence = matches / intent.patterns.length;
      
      if (confidence > bestMatch.confidence) {
        bestMatch = { name: intent.name, confidence };
      }
    }
    
    return bestMatch;
  }

  async translateText(text: string, targetLanguage: string, sourceLanguage = 'auto'): Promise<TranslationResult> {
    const detectedSource = sourceLanguage === 'auto' ? this.detectLanguage(text) : sourceLanguage;
    
    // Simple translation simulation
    let translatedText = text;
    
    if (detectedSource === 'ar' && targetLanguage === 'en') {
      translatedText = this.simulateArabicToEnglish(text);
    } else if (detectedSource === 'en' && targetLanguage === 'ar') {
      translatedText = this.simulateEnglishToArabic(text);
    }
    
    return {
      originalText: text,
      translatedText,
      sourceLanguage: detectedSource,
      targetLanguage,
      confidence: 0.85 + Math.random() * 0.1
    };
  }

  private simulateArabicToEnglish(text: string): string {
    const translations = new Map([
      ['مرحبا', 'Hello'],
      ['كيف حالك', 'How are you'],
      ['شكرا', 'Thank you'],
      ['من فضلك', 'Please'],
      ['نعم', 'Yes'],
      ['لا', 'No']
    ]);
    
    let result = text;
    translations.forEach((english, arabic) => {
      result = result.replace(new RegExp(arabic, 'g'), english);
    });
    
    return result;
  }

  private simulateEnglishToArabic(text: string): string {
    const translations = new Map([
      ['Hello', 'مرحبا'],
      ['How are you', 'كيف حالك'],
      ['Thank you', 'شكرا'],
      ['Please', 'من فضلك'],
      ['Yes', 'نعم'],
      ['No', 'لا']
    ]);
    
    let result = text;
    translations.forEach((arabic, english) => {
      result = result.replace(new RegExp(english, 'gi'), arabic);
    });
    
    return result;
  }

  async generateText(prompt: string, maxLength = 100): Promise<string> {
    // Simple text generation simulation
    const templates = [
      'Based on your input, I can suggest that',
      'In response to your query,',
      'According to the information provided,',
      'To address your concern,',
      'بناءً على استفسارك،',
      'للإجابة على سؤالك،'
    ];
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    const continuation = this.generateContinuation(prompt);
    
    return `${template} ${continuation}`.substring(0, maxLength);
  }

  private generateContinuation(prompt: string): string {
    const continuations = [
      'this is a relevant response to your input.',
      'here are some insights based on your request.',
      'I recommend considering the following options.',
      'هذه استجابة مناسبة لطلبك.',
      'إليك بعض الاقتراحات المفيدة.'
    ];
    
    return continuations[Math.floor(Math.random() * continuations.length)];
  }

  getSupportedLanguages(): string[] {
    return [...this.supportedLanguages];
  }

  getEntityTypes(): string[] {
    return [...this.entityTypes];
  }
}