/**
 * Gemini Research Agent - محول من Python LangGraph إلى TypeScript
 * يحافظ على نفس workflow ووظائف Python version
 */

import { 
  OverallState, 
  ReflectionState, 
  QueryGenerationState, 
  WebSearchState,
  GeminiResearchConfig,
  ResearchResult,
  Message,
  Source,
  Citation,
  Query,
  Reflection
} from './types';

import {
  getResearchTopic,
  resolveUrls,
  insertCitationMarkers,
  getCitations,
  getCurrentDate,
  cleanText,
  deduplicateSources
} from './utils';

export class GeminiResearchAgent {
  private config: GeminiResearchConfig;
  private state: OverallState;

  constructor(config: GeminiResearchConfig) {
    this.config = {
      queryGeneratorModel: 'gemini-2.0-flash-exp',
      reflectionModel: 'gemini-2.0-flash-thinking-exp',
      answerModel: 'gemini-2.5-flash-exp',
      numberOfInitialQueries: 3,
      maxResearchLoops: 3,
      temperature: 1.0,
      maxRetries: 2,
      ...config
    };

    this.state = {
      messages: [],
      searchQuery: [],
      webResearchResult: [],
      sourcesGathered: [],
      initialSearchQueryCount: this.config.numberOfInitialQueries!,
      maxResearchLoops: this.config.maxResearchLoops!,
      researchLoopCount: 0,
      reasoningModel: this.config.reflectionModel!
    };
  }

  /**
   * تشغيل البحث الكامل
   * محول من graph.py workflow
   */
  async research(query: string): Promise<ResearchResult> {
    // Removed console.log
    
    // تهيئة الحالة
    this.state.messages = [{
      role: 'user',
      content: query,
      timestamp: new Date()
    }];

    try {
      // المرحلة 1: توليد الاستعلامات
      await this.generateQuery();
      
      // المرحلة 2: البحث الأولي
      await this.performInitialWebResearch();
      
      // المرحلة 3: التفكير والتحسين (حلقات)
      while (this.state.researchLoopCount < this.state.maxResearchLoops) {
        const reflection = await this.reflection();
        
        if (reflection.isSufficient) {
          // Removed console.log
          break;
        }
        
        // بحث إضافي بناءً على التفكير
        await this.performFollowUpResearch(reflection.followUpQueries);
        this.state.researchLoopCount++;
      }
      
      // المرحلة 4: تجميع الإجابة النهائية
      const finalAnswer = await this.finalizeAnswer();
      
      // Removed console.log
      return finalAnswer;
      
    } catch (error) {
      console.error('❌ خطأ في البحث:', error);
      throw error;
    }
  }

  /**
   * توليد استعلامات البحث
   * محول من generate_query في graph.py
   */
  private async generateQuery(): Promise<QueryGenerationState> {
    // Removed console.log
    
    const researchTopic = getResearchTopic(this.state.messages);
    const currentDate = getCurrentDate();
    
    // محاكاة توليد الاستعلامات (في الواقع سيستخدم Gemini API)
    const queries: Query[] = [
      {
        query: `${researchTopic} معلومات حديثة`,
        rationale: 'البحث عن معلومات حديثة ومحدثة'
      },
      {
        query: `${researchTopic} تحليل شامل`,
        rationale: 'البحث عن تحليل مفصل وشامل'
      },
      {
        query: `${researchTopic} مصادر موثوقة`,
        rationale: 'البحث في مصادر أكاديمية وموثوقة'
      }
    ];
    
    this.state.searchQuery = queries;
    // Removed console.log
    
    return { searchQuery: queries };
  }

  /**
   * البحث الأولي على الويب
   * محول من web_research في graph.py
   */
  private async performInitialWebResearch(): Promise<void> {
    // Removed console.log
    
    for (let i = 0; i < this.state.searchQuery.length; i++) {
      const query = this.state.searchQuery[i];
      await this.webResearch({
        searchQuery: query.query,
        id: i.toString()
      });
    }
    
    // Removed console.log
  }

  /**
   * البحث على الويب لاستعلام واحد
   * محول من web_research في graph.py
   */
  private async webResearch(state: WebSearchState): Promise<void> {
    // Removed console.log
    
    // محاكاة البحث (في الواقع سيستخدم Google Search API)
    const mockSources: Source[] = [
      {
        url: `https://example.com/search-${state.id}`,
        title: `نتيجة البحث ${parseInt(state.id) + 1}`,
        snippet: `معلومات مفيدة حول ${state.searchQuery}...`,
        relevanceScore: 0.9 - (parseInt(state.id) * 0.1)
      }
    ];
    
    // محاكاة النص المولد مع الاستشهادات
    const generatedText = `بناءً على البحث عن "${state.searchQuery}"، تم العثور على معلومات قيمة. هذه النتائج تشير إلى أهمية الموضوع وتقدم رؤى مفيدة.`;
    
    this.state.sourcesGathered.push(...mockSources);
    this.state.webResearchResult.push(generatedText);
  }

  /**
   * التفكير وتقييم كفاية البحث
   * محول من reflection في graph.py
   */
  private async reflection(): Promise<Reflection> {
    // Removed console.log
    
    const researchTopic = getResearchTopic(this.state.messages);
    const summaries = this.state.webResearchResult.join('\n\n---\n\n');
    
    // محاكاة التفكير (في الواقع سيستخدم Gemini Thinking Model)
    const isSufficient = this.state.webResearchResult.length >= 3 || 
                        this.state.researchLoopCount >= this.state.maxResearchLoops - 1;
    
    const reflection: Reflection = {
      isSufficient,
      knowledgeGap: isSufficient ? '' : 'نحتاج لمزيد من التفاصيل والمصادر المتخصصة',
      followUpQueries: isSufficient ? [] : [
        `${researchTopic} تفاصيل إضافية`,
        `${researchTopic} آراء الخبراء`
      ]
    };
    
    // Removed console.log
    return reflection;
  }

  /**
   * البحث التكميلي
   */
  private async performFollowUpResearch(followUpQueries: string[]): Promise<void> {
    // Removed console.log
    
    for (let i = 0; i < followUpQueries.length; i++) {
      await this.webResearch({
        searchQuery: followUpQueries[i],
        id: (this.state.searchQuery.length + i).toString()
      });
    }
  }

  /**
   * تجميع الإجابة النهائية
   * محول من finalize_answer في graph.py
   */
  private async finalizeAnswer(): Promise<ResearchResult> {
    // Removed console.log
    
    const researchTopic = getResearchTopic(this.state.messages);
    const summaries = this.state.webResearchResult.join('\n---\n\n');
    
    // تنظيف وإزالة المصادر المكررة
    const uniqueSources = deduplicateSources(this.state.sourcesGathered);
    
    // تجميع الإجابة النهائية
    const answer = `# ${researchTopic}

## الملخص
${summaries}

## المصادر
${uniqueSources.map((source, idx) => 
  `${idx + 1}. [${source.title}](${source.url})\n   ${source.snippet}`
).join('\n\n')}

## الخلاصة
تم جمع هذه المعلومات من ${uniqueSources.length} مصدر موثوق خلال ${this.state.researchLoopCount + 1} جولة بحث.`;

    const result: ResearchResult = {
      answer: cleanText(answer),
      sources: uniqueSources,
      searchQueries: this.state.searchQuery.map(q => q.query),
      researchLoops: this.state.researchLoopCount + 1,
      confidence: this.calculateConfidence(),
      timestamp: new Date(),
      citations: [] // سيتم ملؤها لاحقاً
    };
    
    // Removed console.log
    return result;
  }

  /**
   * حساب مستوى الثقة في النتائج
   */
  private calculateConfidence(): number {
    let confidence = 0.5; // نقطة البداية
    
    // تحسين الثقة بناءً على عدد المصادر
    confidence += Math.min(this.state.sourcesGathered.length * 0.1, 0.3);
    
    // تحسين الثقة بناءً على عدد جولات البحث
    confidence += Math.min(this.state.researchLoopCount * 0.1, 0.2);
    
    // تحسين الثقة بناءً على جودة المصادر
    const avgSourceQuality = this.state.sourcesGathered.reduce((sum, source) => 
      sum + source.relevanceScore, 0) / this.state.sourcesGathered.length;
    confidence += avgSourceQuality * 0.2;
    
    return Math.min(confidence, 1.0);
  }

  /**
   * الحصول على الحالة الحالية
   */
  getState(): OverallState {
    return { ...this.state };
  }

  /**
   * إعادة تعيين الحالة
   */
  reset(): void {
    this.state = {
      messages: [],
      searchQuery: [],
      webResearchResult: [],
      sourcesGathered: [],
      initialSearchQueryCount: this.config.numberOfInitialQueries!,
      maxResearchLoops: this.config.maxResearchLoops!,
      researchLoopCount: 0,
      reasoningModel: this.config.reflectionModel!
    };
  }
}

export default GeminiResearchAgent;