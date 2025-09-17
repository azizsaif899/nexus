import { Injectable } from '@nestjs/common';
import { CreateContentDto, UpdateContentDto, ContentQueryDto } from './dto/content.dto';

@Injectable()
export class ContentService {
  private contents = new Map();

  async create(createContentDto: CreateContentDto) {
    const id = Date.now().toString();
    const content = {
      id,
      ...createContentDto,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft'
    };
    
    this.contents.set(id, content);
    return content;
  }

  async findAll(query: ContentQueryDto) {
    const allContent = Array.from(this.contents.values());
    
    let filtered = allContent;
    
    if (query.type) {
      filtered = filtered.filter(c => c.type === query.type);
    }
    
    if (query.status) {
      filtered = filtered.filter(c => c.status === query.status);
    }
    
    if (query.category) {
      filtered = filtered.filter(c => c.categories?.includes(query.category));
    }
    
    return {
      data: filtered,
      total: filtered.length
    };
  }

  async findOne(id: string) {
    const content = this.contents.get(id);
    if (!content) {
      throw new Error('Content not found');
    }
    return content;
  }

  async update(id: string, updateContentDto: UpdateContentDto) {
    const content = this.contents.get(id);
    if (!content) {
      throw new Error('Content not found');
    }
    
    const updated = {
      ...content,
      ...updateContentDto,
      updatedAt: new Date()
    };
    
    this.contents.set(id, updated);
    return updated;
  }

  async remove(id: string) {
    const deleted = this.contents.delete(id);
    if (!deleted) {
      throw new Error('Content not found');
    }
    return { message: 'Content deleted successfully' };
  }

  async publish(id: string) {
    const content = this.contents.get(id);
    if (!content) {
      throw new Error('Content not found');
    }
    
    content.status = 'published';
    content.publishedAt = new Date();
    content.updatedAt = new Date();
    
    this.contents.set(id, content);
    return content;
  }

  async search(query: string) {
    const allContent = Array.from(this.contents.values());
    const results = allContent.filter(content => 
      content.title?.toLowerCase().includes(query.toLowerCase()) ||
      content.content?.toLowerCase().includes(query.toLowerCase()) ||
      content.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    return {
      query,
      results,
      total: results.length
    };
  }

  async findByCategory(category: string) {
    const allContent = Array.from(this.contents.values());
    const results = allContent.filter(content => 
      content.categories?.includes(category)
    );
    
    return {
      category,
      results,
      total: results.length
    };
  }

  async findByTag(tag: string) {
    const allContent = Array.from(this.contents.values());
    const results = allContent.filter(content => 
      content.tags?.includes(tag)
    );
    
    return {
      tag,
      results,
      total: results.length
    };
  }
}
