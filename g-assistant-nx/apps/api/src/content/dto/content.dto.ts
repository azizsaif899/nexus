export class CreateContentDto {
  title: string;
  content: string;
  type: 'article' | 'faq' | 'documentation' | 'tutorial';
  categories?: string[];
  tags?: string[];
  language?: string;
  authorId: string;
}

export class UpdateContentDto {
  title?: string;
  content?: string;
  type?: 'article' | 'faq' | 'documentation' | 'tutorial';
  categories?: string[];
  tags?: string[];
  status?: 'draft' | 'review' | 'published' | 'archived';
}

export class ContentQueryDto {
  type?: string;
  status?: string;
  category?: string;
  tag?: string;
  authorId?: string;
  limit?: number;
  offset?: number;
}