import { Injectable } from '@nestjs/common';

@Injectable()
export class AdvancedChatbot {
  private conversationHistory = new Map<string, any[]>();
  private userProfiles = new Map<string, any>();

  async processMessage(userId: string, message: string): Promise<any> {
    // Get conversation context
    const history = this.conversationHistory.get(userId) || [];
    const userProfile = this.userProfiles.get(userId) || {};

    // Analyze message
    const analysis = await this.analyzeMessage(message);
    
    // Generate contextual response
    const response = await this.generateResponse(message, analysis, history, userProfile);
    
    // Update conversation history
    history.push({ role: 'user', content: message, timestamp: new Date() });
    history.push({ role: 'assistant', content: response.text, timestamp: new Date() });
    this.conversationHistory.set(userId, history);
    
    // Update user profile
    this.updateUserProfile(userId, analysis);
    
    return response;
  }

  private async analyzeMessage(message: string): Promise<any> {
    return {
      intent: this.classifyIntent(message),
      entities: this.extractEntities(message),
      sentiment: this.analyzeSentiment(message),
      language: this.detectLanguage(message),
      complexity: this.assessComplexity(message)
    };
  }

  private async generateResponse(message: string, analysis: any, history: any[], profile: any): Promise<any> {
    // Context-aware response generation
    const context = this.buildContext(history, profile);
    
    let response = '';
    let actions = [];

    switch (analysis.intent) {
      case 'greeting':
        response = this.generateGreeting(profile);
        break;
      case 'question':
        response = await this.answerQuestion(message, context);
        break;
      case 'request':
        const result = await this.handleRequest(message, analysis.entities);
        response = result.response;
        actions = result.actions;
        break;
      case 'complaint':
        response = this.handleComplaint(message, analysis.sentiment);
        actions = [{ type: 'escalate_to_human', priority: 'high' }];
        break;
      default:
        response = this.generateFallbackResponse(analysis);
    }

    return {
      text: response,
      actions,
      suggestions: this.generateSuggestions(analysis, profile),
      confidence: this.calculateConfidence(analysis)
    };
  }

  private classifyIntent(message: string): string {
    const greetings = ['مرحبا', 'السلام عليكم', 'أهلا', 'hello'];
    const questions = ['ما', 'كيف', 'متى', 'أين', 'لماذا', 'what', 'how'];
    const requests = ['أريد', 'أحتاج', 'ممكن', 'please', 'can you'];
    const complaints = ['مشكلة', 'خطأ', 'لا يعمل', 'problem', 'issue'];

    const lowerMessage = message.toLowerCase();
    
    if (greetings.some(word => lowerMessage.includes(word))) return 'greeting';
    if (questions.some(word => lowerMessage.includes(word))) return 'question';
    if (requests.some(word => lowerMessage.includes(word))) return 'request';
    if (complaints.some(word => lowerMessage.includes(word))) return 'complaint';
    
    return 'general';
  }

  private extractEntities(message: string): any[] {
    // Simple entity extraction
    const entities = [];
    
    // Extract dates
    const dateRegex = /\d{1,2}\/\d{1,2}\/\d{4}/g;
    const dates = message.match(dateRegex);
    if (dates) {
      dates.forEach(date => entities.push({ type: 'date', value: date }));
    }
    
    // Extract numbers
    const numberRegex = /\d+/g;
    const numbers = message.match(numberRegex);
    if (numbers) {
      numbers.forEach(num => entities.push({ type: 'number', value: parseInt(num) }));
    }
    
    return entities;
  }

  private analyzeSentiment(message: string): any {
    // Simple sentiment analysis
    const positiveWords = ['جيد', 'ممتاز', 'رائع', 'أحب'];
    const negativeWords = ['سيء', 'فظيع', 'أكره', 'مشكلة'];
    
    const words = message.toLowerCase().split(' ');
    let score = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });
    
    return {
      score,
      label: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral'
    };
  }

  private detectLanguage(message: string): string {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(message) ? 'arabic' : 'english';
  }

  private assessComplexity(message: string): 'simple' | 'medium' | 'complex' {
    const wordCount = message.split(' ').length;
    if (wordCount < 5) return 'simple';
    if (wordCount < 15) return 'medium';
    return 'complex';
  }

  private buildContext(history: any[], profile: any): any {
    return {
      recentMessages: history.slice(-5),
      userPreferences: profile.preferences || {},
      conversationLength: history.length
    };
  }

  private generateGreeting(profile: any): string {
    const greetings = [
      'مرحباً! كيف يمكنني مساعدتك اليوم؟',
      'أهلاً وسهلاً! أنا هنا لمساعدتك',
      'السلام عليكم! كيف حالك؟'
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  private async answerQuestion(question: string, context: any): Promise<string> {
    // Knowledge-based question answering
    return 'هذا سؤال ممتاز! دعني أبحث عن الإجابة الأفضل لك...';
  }

  private async handleRequest(request: string, entities: any[]): Promise<any> {
    return {
      response: 'سأعمل على تنفيذ طلبك فوراً',
      actions: [{ type: 'process_request', data: { request, entities } }]
    };
  }

  private handleComplaint(complaint: string, sentiment: any): string {
    return 'أعتذر عن هذه المشكلة. سأقوم بتحويلك إلى أحد المختصين لحل هذه المسألة بأسرع وقت ممكن.';
  }

  private generateFallbackResponse(analysis: any): string {
    return 'أفهم ما تقوله، ولكن أحتاج المزيد من التوضيح لأتمكن من مساعدتك بشكل أفضل.';
  }

  private generateSuggestions(analysis: any, profile: any): string[] {
    return [
      'هل تريد معرفة المزيد حول هذا الموضوع؟',
      'يمكنني مساعدتك في مواضيع أخرى',
      'هل لديك أسئلة إضافية؟'
    ];
  }

  private calculateConfidence(analysis: any): number {
    // Calculate response confidence based on analysis
    let confidence = 0.5;
    
    if (analysis.intent !== 'general') confidence += 0.2;
    if (analysis.entities.length > 0) confidence += 0.1;
    if (analysis.sentiment.label !== 'neutral') confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  private updateUserProfile(userId: string, analysis: any): void {
    const profile = this.userProfiles.get(userId) || { preferences: {}, interactions: 0 };
    
    profile.interactions += 1;
    profile.lastInteraction = new Date();
    profile.preferredLanguage = analysis.language;
    
    this.userProfiles.set(userId, profile);
  }
}