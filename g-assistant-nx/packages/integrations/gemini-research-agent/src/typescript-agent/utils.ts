/**
 * Utils للـ Gemini Research Agent - محول من Python utils.py
 */

import { Message, Source, Citation, SourceSegment, GoogleSearchResponse } from './types';

/**
 * استخراج موضوع البحث من الرسائل
 * محول من get_research_topic في utils.py
 */
export function getResearchTopic(messages: Message[]): string {
  if (messages.length === 1) {
    return messages[messages.length - 1].content;
  }
  
  let researchTopic = '';
  for (const message of messages) {
    if (message.role === 'user') {
      researchTopic += `User: ${message.content}\n`;
    } else if (message.role === 'assistant') {
      researchTopic += `Assistant: ${message.content}\n`;
    }
  }
  
  return researchTopic;
}

/**
 * تحويل URLs الطويلة إلى URLs قصيرة
 * محول من resolve_urls في utils.py
 */
export function resolveUrls(urlsToResolve: any[], id: number): Record<string, string> {
  const prefix = 'https://vertexaisearch.cloud.google.com/id/';
  const urls = urlsToResolve.map(site => site.web?.uri).filter(Boolean);
  
  const resolvedMap: Record<string, string> = {};
  urls.forEach((url, idx) => {
    if (url && !resolvedMap[url]) {
      resolvedMap[url] = `${prefix}${id}-${idx}`;
    }
  });
  
  return resolvedMap;
}

/**
 * إدراج علامات الاستشهاد في النص
 * محول من insert_citation_markers في utils.py
 */
export function insertCitationMarkers(text: string, citationsList: Citation[]): string {
  // ترتيب الاستشهادات حسب end_index بترتيب تنازلي
  const sortedCitations = [...citationsList].sort((a, b) => {
    if (b.endIndex !== a.endIndex) {
      return b.endIndex - a.endIndex;
    }
    return b.startIndex - a.startIndex;
  });
  
  let modifiedText = text;
  for (const citation of sortedCitations) {
    const endIdx = citation.endIndex;
    let markerToInsert = '';
    
    for (const segment of citation.segments) {
      markerToInsert += ` [${segment.title}](${segment.short_url})`;
    }
    
    modifiedText = modifiedText.slice(0, endIdx) + markerToInsert + modifiedText.slice(endIdx);
  }
  
  return modifiedText;
}

/**
 * استخراج الاستشهادات من استجابة Gemini
 * محول من get_citations في utils.py
 */
export function getCitations(response: GoogleSearchResponse, resolvedUrlsMap: Record<string, string>): Citation[] {
  const citations: Citation[] = [];
  
  if (!response || !response.candidates || response.candidates.length === 0) {
    return citations;
  }
  
  const candidate = response.candidates[0];
  if (!candidate.grounding_metadata || !candidate.grounding_metadata.grounding_chunks) {
    return citations;
  }
  
  // محاكاة معالجة grounding_supports (مبسطة)
  const groundingChunks = candidate.grounding_metadata.grounding_chunks;
  
  groundingChunks.forEach((chunk, index) => {
    if (chunk.web) {
      const resolvedUrl = resolvedUrlsMap[chunk.web.uri];
      if (resolvedUrl) {
        const segment: SourceSegment = {
          short_url: resolvedUrl,
          value: chunk.web.uri,
          title: chunk.web.title?.split('.')[0] || 'مصدر',
          snippet: ''
        };
        
        const citation: Citation = {
          startIndex: 0, // سيتم تحديدها لاحقاً
          endIndex: response.text?.length || 0,
          segments: [segment],
          text: response.text || ''
        };
        
        citations.push(citation);
      }
    }
  });
  
  return citations;
}

/**
 * تنسيق التاريخ الحالي
 * مساعد للـ prompts
 */
export function getCurrentDate(): string {
  return new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
}

/**
 * تنظيف وتنسيق النص
 */
export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}

/**
 * تقييم جودة المصادر
 */
export function evaluateSourceQuality(source: Source): number {
  let score = 0.5; // نقطة البداية
  
  // تحسين النقاط بناءً على المجال
  const domain = new URL(source.url).hostname.toLowerCase();
  if (domain.includes('edu') || domain.includes('gov')) {
    score += 0.3;
  } else if (domain.includes('org')) {
    score += 0.2;
  } else if (domain.includes('wikipedia')) {
    score += 0.1;
  }
  
  // تحسين النقاط بناءً على طول المحتوى
  if (source.snippet && source.snippet.length > 100) {
    score += 0.1;
  }
  
  // تحسين النقاط بناءً على وجود العنوان
  if (source.title && source.title.length > 10) {
    score += 0.1;
  }
  
  return Math.min(score, 1.0);
}

/**
 * إزالة المصادر المكررة
 */
export function deduplicateSources(sources: Source[]): Source[] {
  const seen = new Set<string>();
  return sources.filter(source => {
    const key = source.url.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * تحويل النص إلى slug للـ URLs
 */
export function textToSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '') // الحفاظ على العربية والإنجليزية
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * تقدير وقت القراءة
 */
export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200; // متوسط سرعة القراءة
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * تحليل المشاعر البسيط
 */
export function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['جيد', 'ممتاز', 'رائع', 'مفيد', 'إيجابي'];
  const negativeWords = ['سيء', 'ضعيف', 'خطأ', 'مشكلة', 'سلبي'];
  
  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}