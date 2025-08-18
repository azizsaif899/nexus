import { Injectable } from '@nestjs/common';

@Injectable()
export class CitationManager {
  private urlMap = new Map<string, string>();
  private citationCounter = 0;

  resolveUrls(urls: string[], id: number): Map<string, string> {
    const prefix = 'https://vertexaisearch.cloud.google.com/id/';
    const resolvedMap = new Map<string, string>();
    
    urls.forEach((url, idx) => {
      if (!resolvedMap.has(url)) {
        resolvedMap.set(url, `${prefix}${id}-${idx}`);
      }
    });
    
    return resolvedMap;
  }

  insertCitationMarkers(text: string, citations: any[]): string {
    const sortedCitations = citations.sort((a, b) => 
      b.end_index - a.end_index || b.start_index - a.start_index
    );

    let modifiedText = text;
    
    for (const citation of sortedCitations) {
      const endIdx = citation.end_index;
      let markerToInsert = '';
      
      for (const segment of citation.segments || []) {
        markerToInsert += ` [${segment.label}](${segment.short_url})`;
      }
      
      modifiedText = modifiedText.slice(0, endIdx) + markerToInsert + modifiedText.slice(endIdx);
    }
    
    return modifiedText;
  }

  extractCitations(response: any, resolvedUrlsMap: Map<string, string>): any[] {
    const citations = [];
    
    if (!response?.candidates?.[0]?.grounding_metadata?.grounding_supports) {
      return citations;
    }

    const candidate = response.candidates[0];
    
    for (const support of candidate.grounding_metadata.grounding_supports) {
      if (!support.segment) continue;
      
      const citation = {
        start_index: support.segment.start_index || 0,
        end_index: support.segment.end_index,
        segments: []
      };

      if (support.grounding_chunk_indices) {
        for (const ind of support.grounding_chunk_indices) {
          try {
            const chunk = candidate.grounding_metadata.grounding_chunks[ind];
            const resolvedUrl = resolvedUrlsMap.get(chunk.web.uri);
            
            citation.segments.push({
              label: chunk.web.title.split('.')[0],
              short_url: resolvedUrl,
              value: chunk.web.uri
            });
          } catch (error) {
            // Skip problematic chunks
            continue;
          }
        }
      }
      
      citations.push(citation);
    }
    
    return citations;
  }

  generateCitation(source: any): any {
    this.citationCounter++;
    
    return {
      id: this.citationCounter,
      title: source.title,
      url: source.url,
      type: source.type || 'web',
      accessDate: new Date().toISOString(),
      shortUrl: this.generateShortUrl(source.url)
    };
  }

  private generateShortUrl(originalUrl: string): string {
    if (this.urlMap.has(originalUrl)) {
      return this.urlMap.get(originalUrl);
    }
    
    const shortUrl = `https://cite.ai/${this.citationCounter}`;
    this.urlMap.set(originalUrl, shortUrl);
    return shortUrl;
  }

  formatCitations(citations: any[]): string {
    return citations.map((citation, index) => 
      `[${index + 1}] ${citation.title}. ${citation.url}. Accessed: ${new Date(citation.accessDate).toLocaleDateString()}`
    ).join('\n');
  }

  getCitationStats(): any {
    return {
      totalCitations: this.citationCounter,
      uniqueUrls: this.urlMap.size,
      averageCitationsPerUrl: this.citationCounter / Math.max(this.urlMap.size, 1)
    };
  }
}