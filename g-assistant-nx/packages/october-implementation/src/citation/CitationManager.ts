/**
 * Citation Manager - مدير الاستشهادات الذكي
 */

import { Citation, Source } from '../types';

export class CitationManager {
  private citations: Map<string, Citation> = new Map();

  /**
   * إنشاء استشهاد جديد
   */
  createCitation(source: Source, text: string, context: string): Citation {
    const id = this.generateCitationId(source);
    
    const citation: Citation = {
      id,
      source,
      text,
      context,
      confidence: this.calculateConfidence(source, text)
    };

    this.citations.set(id, citation);
    return citation;
  }

  /**
   * الحصول على جميع الاستشهادات
   */
  getAllCitations(): Citation[] {
    return Array.from(this.citations.values());
  }

  /**
   * البحث في الاستشهادات
   */
  searchCitations(query: string): Citation[] {
    return this.getAllCitations().filter(citation =>
      citation.text.toLowerCase().includes(query.toLowerCase()) ||
      citation.source.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * تنسيق الاستشهاد للعرض
   */
  formatCitation(citationId: string, style: 'apa' | 'mla' | 'chicago' = 'apa'): string {
    const citation = this.citations.get(citationId);
    if (!citation) return '';

    switch (style) {
      case 'apa':
        return this.formatAPA(citation);
      case 'mla':
        return this.formatMLA(citation);
      case 'chicago':
        return this.formatChicago(citation);
      default:
        return this.formatAPA(citation);
    }
  }

  /**
   * تصدير الاستشهادات
   */
  exportCitations(format: 'json' | 'bibtex' | 'csv' = 'json'): string {
    const citations = this.getAllCitations();
    
    switch (format) {
      case 'json':
        return JSON.stringify(citations, null, 2);
      case 'bibtex':
        return this.toBibTeX(citations);
      case 'csv':
        return this.toCSV(citations);
      default:
        return JSON.stringify(citations, null, 2);
    }
  }

  private generateCitationId(source: Source): string {
    const domain = new URL(source.url).hostname;
    const timestamp = Date.now();
    return `${domain}-${timestamp}`.replace(/[^a-zA-Z0-9-]/g, '');
  }

  private calculateConfidence(source: Source, text: string): number {
    let confidence = source.relevanceScore || 0.5;
    
    // تحسين الثقة بناءً على طول النص
    if (text.length > 100) confidence += 0.1;
    if (text.length > 500) confidence += 0.1;
    
    // تحسين الثقة بناءً على المجال
    const domain = new URL(source.url).hostname;
    if (domain.includes('edu') || domain.includes('gov')) {
      confidence += 0.2;
    }
    
    return Math.min(confidence, 1.0);
  }

  private formatAPA(citation: Citation): string {
    const domain = new URL(citation.source.url).hostname;
    const date = citation.source.publishDate?.getFullYear() || 'n.d.';
    
    return `${citation.source.title}. (${date}). ${domain}. ${citation.source.url}`;
  }

  private formatMLA(citation: Citation): string {
    const domain = new URL(citation.source.url).hostname;
    const date = citation.source.publishDate?.toLocaleDateString() || 'n.d.';
    
    return `"${citation.source.title}." ${domain}, ${date}, ${citation.source.url}.`;
  }

  private formatChicago(citation: Citation): string {
    const domain = new URL(citation.source.url).hostname;
    const date = citation.source.publishDate?.toLocaleDateString() || 'n.d.';
    
    return `"${citation.source.title}." ${domain}. Accessed ${date}. ${citation.source.url}.`;
  }

  private toBibTeX(citations: Citation[]): string {
    return citations.map(citation => {
      const domain = new URL(citation.source.url).hostname.replace(/\./g, '');
      const year = citation.source.publishDate?.getFullYear() || new Date().getFullYear();
      
      return `@misc{${citation.id},
  title={${citation.source.title}},
  url={${citation.source.url}},
  journal={${domain}},
  year={${year}},
  note={Accessed: ${new Date().toLocaleDateString()}}
}`;
    }).join('\n\n');
  }

  private toCSV(citations: Citation[]): string {
    const headers = 'ID,Title,URL,Domain,Confidence,Text';
    const rows = citations.map(citation => {
      const domain = new URL(citation.source.url).hostname;
      return `"${citation.id}","${citation.source.title}","${citation.source.url}","${domain}","${citation.confidence}","${citation.text.replace(/"/g, '""')}"`;
    });
    
    return [headers, ...rows].join('\n');
  }
}

export default CitationManager;