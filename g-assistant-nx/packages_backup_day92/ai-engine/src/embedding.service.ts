export type TaskType = 'RETRIEVAL_DOCUMENT' | 'SEMANTIC_SIMILARITY' | 'CLASSIFICATION' | 'CLUSTERING';

export class EmbeddingService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateEmbedding(text: string, taskType: TaskType = 'SEMANTIC_SIMILARITY'): Promise<number[]> {
    console.log(`🧠 Generating embedding for task: ${taskType}`);
    
    // Mock embedding - في الإنتاج سيتم استخدام Gemini Embedding API
    const mockEmbedding = new Array(768).fill(0).map(() => Math.random() - 0.5);
    
    return mockEmbedding;
  }

  async generateBatchEmbeddings(texts: string[], taskType: TaskType = 'SEMANTIC_SIMILARITY'): Promise<number[][]> {
    console.log(`🧠 Generating ${texts.length} embeddings for task: ${taskType}`);
    
    const embeddings = [];
    for (const text of texts) {
      embeddings.push(await this.generateEmbedding(text, taskType));
    }
    
    return embeddings;
  }

  calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    // Cosine similarity
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }
    
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }
}