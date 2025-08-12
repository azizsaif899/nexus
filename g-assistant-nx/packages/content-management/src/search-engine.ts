import Fuse from 'fuse.js';
import { ContentItem, SearchQuery, SearchResults } from './types';

export class SemanticSearchEngine {
  private fuse: Fuse<ContentItem>;
  private contentIndex: Map<string, ContentItem> = new Map();

  constructor() {
    const options = {
      keys: [
        { name: 'title', weight: 0.3 },
        { name: 'content', weight: 0.4 },
        { name: 'tags', weight: 0.2 },
        { name: 'metadata.keywords', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true
    };

    this.fuse = new Fuse([], options);
  }

  async index(content: ContentItem): Promise<void> {
    this.contentIndex.set(content.id, content);
    this.rebuildIndex();
  }

  async reindex(content: ContentItem): Promise<void> {
    this.contentIndex.set(content.id, content);
    this.rebuildIndex();
  }

  async remove(contentId: string): Promise<void> {
    this.contentIndex.delete(contentId);
    this.rebuildIndex();
  }

  async semanticSearch(query: SearchQuery): Promise<ContentItem[]> {
    let results = this.fuse.search(query.query);

    // Apply filters
    if (query.filters) {
      results = results.filter(result => {
        const content = result.item;

        // Type filter
        if (query.filters!.type && !query.filters!.type.includes(content.type)) {
          return false;
        }

        // Status filter
        if (query.filters!.status && !query.filters!.status.includes(content.status)) {
          return false;
        }

        // Author filter
        if (query.filters!.author && !query.filters!.author.includes(content.author.id)) {
          return false;
        }

        // Tags filter
        if (query.filters!.tags) {
          const hasMatchingTag = query.filters!.tags.some(tag => 
            content.tags.includes(tag)
          );
          if (!hasMatchingTag) return false;
        }

        // Categories filter
        if (query.filters!.categories) {
          const hasMatchingCategory = query.filters!.categories.some(category => 
            content.categories.includes(category)
          );
          if (!hasMatchingCategory) return false;
        }

        // Date range filter
        if (query.filters!.dateRange) {
          const contentDate = content.publishedAt || content.createdAt;
          if (contentDate < query.filters!.dateRange.start || 
              contentDate > query.filters!.dateRange.end) {
            return false;
          }
        }

        return true;
      });
    }

    // Sort results
    if (query.sort) {
      results.sort((a, b) => {
        const aValue = this.getFieldValue(a.item, query.sort!.field);
        const bValue = this.getFieldValue(b.item, query.sort!.field);
        
        if (query.sort!.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || 10;
    const paginatedResults = results.slice(offset, offset + limit);

    return paginatedResults.map(result => result.item);
  }

  async findSimilar(contentId: string, limit: number = 5): Promise<ContentItem[]> {
    const content = this.contentIndex.get(contentId);
    if (!content) return [];

    // Create a search query based on the content's tags and categories
    const searchTerms = [...content.tags, ...content.categories, content.title].join(' ');
    
    const results = this.fuse.search(searchTerms);
    
    return results
      .filter(result => result.item.id !== contentId)
      .slice(0, limit)
      .map(result => result.item);
  }

  async getPopularContent(limit: number = 10): Promise<ContentItem[]> {
    // Mock implementation - in reality, this would use view counts, engagement metrics, etc.
    const allContent = Array.from(this.contentIndex.values());
    
    return allContent
      .filter(content => content.status === 'published')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getRecentContent(limit: number = 10): Promise<ContentItem[]> {
    const allContent = Array.from(this.contentIndex.values());
    
    return allContent
      .filter(content => content.status === 'published')
      .sort((a, b) => b.publishedAt!.getTime() - a.publishedAt!.getTime())
      .slice(0, limit);
  }

  async getTrendingTags(limit: number = 20): Promise<{ tag: string; count: number }[]> {
    const tagCounts = new Map<string, number>();
    
    for (const content of this.contentIndex.values()) {
      if (content.status === 'published') {
        for (const tag of content.tags) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        }
      }
    }

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  async getContentByTag(tag: string, limit: number = 10): Promise<ContentItem[]> {
    const allContent = Array.from(this.contentIndex.values());
    
    return allContent
      .filter(content => 
        content.status === 'published' && 
        content.tags.includes(tag)
      )
      .sort((a, b) => b.publishedAt!.getTime() - a.publishedAt!.getTime())
      .slice(0, limit);
  }

  async getContentByCategory(category: string, limit: number = 10): Promise<ContentItem[]> {
    const allContent = Array.from(this.contentIndex.values());
    
    return allContent
      .filter(content => 
        content.status === 'published' && 
        content.categories.includes(category)
      )
      .sort((a, b) => b.publishedAt!.getTime() - a.publishedAt!.getTime())
      .slice(0, limit);
  }

  async getContentByAuthor(authorId: string, limit: number = 10): Promise<ContentItem[]> {
    const allContent = Array.from(this.contentIndex.values());
    
    return allContent
      .filter(content => 
        content.status === 'published' && 
        content.author.id === authorId
      )
      .sort((a, b) => b.publishedAt!.getTime() - a.publishedAt!.getTime())
      .slice(0, limit);
  }

  async generateSearchSuggestions(query: string): Promise<string[]> {
    // Simple suggestion generation based on existing content
    const allContent = Array.from(this.contentIndex.values());
    const suggestions = new Set<string>();

    // Extract keywords from titles and tags
    for (const content of allContent) {
      if (content.status === 'published') {
        // Add title words
        const titleWords = content.title.toLowerCase().split(/\s+/);
        titleWords.forEach(word => {
          if (word.length > 3 && word.includes(query.toLowerCase())) {
            suggestions.add(content.title);
          }
        });

        // Add tags
        content.tags.forEach(tag => {
          if (tag.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(tag);
          }
        });
      }
    }

    return Array.from(suggestions).slice(0, 5);
  }

  private rebuildIndex(): void {
    const contentArray = Array.from(this.contentIndex.values());
    this.fuse.setCollection(contentArray);
  }

  private getFieldValue(item: ContentItem, field: string): any {
    const fields = field.split('.');
    let value: any = item;
    
    for (const f of fields) {
      value = value?.[f];
    }
    
    return value;
  }
}