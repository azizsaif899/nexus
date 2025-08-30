import { Injectable } from '@nestjs/common';
import { firestoreService } from '@azizsys/core/services/firestore.service';

@Injectable()
export class QueriesService {
  private readonly collection = 'queries';

  async logQuery(queryData: {
    query: string;
    response: string;
    agentType?: string;
    userId?: string;
    metadata?: any;
  }) {
    if (!queryData.query || !queryData.response) {
      throw new Error('Query and response are required');
    }

    const logData = {
      query: queryData.query,
      response: queryData.response,
      agentType: queryData.agentType || 'general',
      userId: queryData.userId || 'anonymous',
      metadata: queryData.metadata || {},
      timestamp: new Date(),
      status: 'completed',
      createdAt: new Date()
    };
    
    const queryId = await firestoreService.addDoc(this.collection, logData);
    console.log(`Query logged with ID: ${queryId}`);
    return { id: queryId, ...logData };
  }

  async saveQuery(query: string, response: string, agentType: string, userId?: string) {
    return await this.logQuery({ query, response, agentType, userId });
  }

  async getAllQueries() {
    return await firestoreService.getAll(this.collection);
  }

  async getQueriesByAgent(agentType: string) {
    return await firestoreService.queryWhere(this.collection, 'agentType', '==', agentType);
  }

  async getQueriesByUser(userId: string) {
    return await firestoreService.queryWhere(this.collection, 'userId', '==', userId);
  }

  async getQueryById(id: string) {
    return await firestoreService.getById(this.collection, id);
  }
}