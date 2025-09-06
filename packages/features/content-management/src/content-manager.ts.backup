import { v4 as uuidv4 } from 'uuid';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import {
  ContentItem,
  ContentType,
  ContentStatus,
  CreateContentRequest,
  UpdateContentRequest,
  SearchQuery,
  SearchResults,
  User
} from './types';
import { SemanticSearchEngine } from './search-engine';
import { AIContentAssistant } from './ai-assistant';

export class ContentRepository {
  private contents: Map<string, ContentItem> = new Map();
  private versions: Map<string, ContentItem[]> = new Map();

  async save(content: ContentItem): Promise<void> {
    this.contents.set(content.id, content);
  }

  async findById(id: string): Promise<ContentItem | null> {
    return this.contents.get(id) || null;
  }

  async findAll(): Promise<ContentItem[]> {
    return Array.from(this.contents.values());
  }

  async saveVersion(content: ContentItem): Promise<void> {
    if (!this.versions.has(content.id)) {
      this.versions.set(content.id, []);
    }
    this.versions.get(content.id)!.push({ ...content });
  }

  async getVersions(contentId: string): Promise<ContentItem[]> {
    return this.versions.get(contentId) || [];
  }

  async delete(id: string): Promise<void> {
    this.contents.delete(id);
    this.versions.delete(id);
  }
}

export class WorkflowEngine {
  async startApprovalWorkflow(content: ContentItem): Promise<void> {
    // Removed console.log
    // Mock workflow implementation
  }
}

export class ContentManager {
  private repository: ContentRepository;
  private searchEngine: SemanticSearchEngine;
  private workflowEngine: WorkflowEngine;
  private aiAssistant: AIContentAssistant;

  constructor() {
    this.repository = new ContentRepository();
    this.searchEngine = new SemanticSearchEngine();
    this.workflowEngine = new WorkflowEngine();
    this.aiAssistant = new AIContentAssistant();
  }

  async createContent(
    contentData: CreateContentRequest,
    author: User
  ): Promise<ContentItem> {
    // Validate content
    await this.validateContent(contentData);

    // Generate AI suggestions
    const aiSuggestions = await this.aiAssistant.generateSuggestions(contentData);

    // Create content item
    const content: ContentItem = {
      id: uuidv4(),
      type: contentData.type,
      title: contentData.title,
      slug: this.generateSlug(contentData.title),
      content: this.sanitizeContent(contentData.content),
      metadata: {
        ...contentData.metadata,
        keywords: contentData.metadata.keywords || [],
        category: contentData.metadata.category || 'general',
        aiSuggestions
      },
      status: ContentStatus.DRAFT,
      author,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      tags: contentData.tags || await this.aiAssistant.suggestTags(contentData.content),
      categories: contentData.categories || await this.aiAssistant.categorizeContent(contentData.content),
      language: contentData.language || 'ar',
      seo: await this.generateSEOMetadata(contentData)
    };

    // Save to repository
    await this.repository.save(content);

    // Index for search
    await this.searchEngine.index(content);

    // Start workflow if needed
    if (contentData.requiresApproval) {
      await this.workflowEngine.startApprovalWorkflow(content);
    }

    return content;
  }

  async updateContent(
    id: string,
    updates: UpdateContentRequest,
    user: User
  ): Promise<ContentItem> {
    const existingContent = await this.repository.findById(id);

    if (!existingContent) {
      throw new Error('Content not found');
    }

    // Check permissions
    await this.checkUpdatePermissions(existingContent, user);

    // Create new version
    const updatedContent: ContentItem = {
      ...existingContent,
      ...updates,
      updatedAt: new Date(),
      version: existingContent.version + 1
    };

    // AI-powered content enhancement
    if (updates.content) {
      updatedContent.content = this.sanitizeContent(updates.content);
      const enhancements = await this.aiAssistant.enhanceContent(updates.content);
      updatedContent.metadata.aiEnhancements = enhancements;
    }

    // Save version history
    await this.repository.saveVersion(existingContent);

    // Update current version
    await this.repository.save(updatedContent);

    // Re-index for search
    await this.searchEngine.reindex(updatedContent);

    return updatedContent;
  }

  async getContent(id: string): Promise<ContentItem | null> {
    return await this.repository.findById(id);
  }

  async getAllContent(): Promise<ContentItem[]> {
    return await this.repository.findAll();
  }

  async searchContent(
    query: SearchQuery,
    user: User
  ): Promise<SearchResults> {
    // Semantic search with AI
    const semanticResults = await this.searchEngine.semanticSearch(query);

    // Filter by permissions
    const filteredResults = await this.filterByPermissions(semanticResults, user);

    // Enhance with AI insights
    const enhancedResults = await this.aiAssistant.enhanceSearchResults(
      filteredResults,
      query
    );

    return {
      results: enhancedResults,
      totalCount: filteredResults.length,
      facets: await this.generateSearchFacets(filteredResults),
      suggestions: await this.aiAssistant.generateSearchSuggestions(query.query)
    };
  }

  async publishContent(id: string, user: User): Promise<ContentItem> {
    const content = await this.repository.findById(id);
    if (!content) {
      throw new Error('Content not found');
    }

    // Check permissions
    await this.checkPublishPermissions(content, user);

    const publishedContent: ContentItem = {
      ...content,
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
      updatedAt: new Date()
    };

    await this.repository.save(publishedContent);
    await this.searchEngine.reindex(publishedContent);

    return publishedContent;
  }

  async archiveContent(id: string, user: User): Promise<ContentItem> {
    const content = await this.repository.findById(id);
    if (!content) {
      throw new Error('Content not found');
    }

    const archivedContent: ContentItem = {
      ...content,
      status: ContentStatus.ARCHIVED,
      updatedAt: new Date()
    };

    await this.repository.save(archivedContent);
    await this.searchEngine.remove(id);

    return archivedContent;
  }

  async getContentVersions(id: string): Promise<ContentItem[]> {
    return await this.repository.getVersions(id);
  }

  async restoreVersion(contentId: string, version: number, user: User): Promise<ContentItem> {
    const versions = await this.repository.getVersions(contentId);
    const targetVersion = versions.find(v => v.version === version);

    if (!targetVersion) {
      throw new Error('Version not found');
    }

    const restoredContent: ContentItem = {
      ...targetVersion,
      id: contentId,
      version: (await this.repository.findById(contentId))!.version + 1,
      updatedAt: new Date()
    };

    await this.repository.save(restoredContent);
    await this.searchEngine.reindex(restoredContent);

    return restoredContent;
  }

  private async validateContent(contentData: CreateContentRequest): Promise<void> {
    if (!contentData.title || contentData.title.trim().length === 0) {
      throw new Error('Title is required');
    }

    if (!contentData.content || contentData.content.trim().length === 0) {
      throw new Error('Content is required');
    }

    if (contentData.title.length > 200) {
      throw new Error('Title is too long (max 200 characters)');
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private sanitizeContent(content: string): string {
    // Convert markdown to HTML if needed
    const html = marked(content);
    
    // Sanitize HTML to prevent XSS
    return DOMPurify.sanitize(html);
  }

  private async generateSEOMetadata(contentData: CreateContentRequest) {
    const title = contentData.title;
    const description = contentData.metadata.description || 
      contentData.content.substring(0, 160) + '...';
    
    return {
      title,
      description,
      keywords: contentData.metadata.keywords || [],
      canonicalUrl: `/content/${this.generateSlug(title)}`,
      ogImage: contentData.metadata.ogImage
    };
  }

  private async checkUpdatePermissions(content: ContentItem, user: User): Promise<void> {
    // Simple permission check - in reality, this would be more sophisticated
    if (content.author.id !== user.id && user.role !== 'admin') {
      throw new Error('Insufficient permissions to update content');
    }
  }

  private async checkPublishPermissions(content: ContentItem, user: User): Promise<void> {
    if (user.role !== 'admin' && user.role !== 'editor') {
      throw new Error('Insufficient permissions to publish content');
    }
  }

  private async filterByPermissions(results: ContentItem[], user: User): Promise<ContentItem[]> {
    // Simple permission filtering
    return results.filter(content => {
      if (content.status === ContentStatus.PUBLISHED) return true;
      if (content.author.id === user.id) return true;
      if (user.role === 'admin' || user.role === 'editor') return true;
      return false;
    });
  }

  private async generateSearchFacets(results: ContentItem[]) {
    const facets = {
      types: {} as { [key: string]: number },
      authors: {} as { [key: string]: number },
      tags: {} as { [key: string]: number },
      categories: {} as { [key: string]: number }
    };

    for (const result of results) {
      // Count types
      facets.types[result.type] = (facets.types[result.type] || 0) + 1;
      
      // Count authors
      facets.authors[result.author.name] = (facets.authors[result.author.name] || 0) + 1;
      
      // Count tags
      for (const tag of result.tags) {
        facets.tags[tag] = (facets.tags[tag] || 0) + 1;
      }
      
      // Count categories
      for (const category of result.categories) {
        facets.categories[category] = (facets.categories[category] || 0) + 1;
      }
    }

    return facets;
  }
}