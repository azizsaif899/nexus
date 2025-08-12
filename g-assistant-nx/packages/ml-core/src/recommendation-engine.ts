import { Injectable } from '@nestjs/common';

@Injectable()
export class RecommendationEngine {
  private userProfiles = new Map<string, any>();
  private itemFeatures = new Map<string, any>();

  async getRecommendations(userId: string, limit = 10): Promise<any[]> {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) {
      return this.getPopularItems(limit);
    }

    // Collaborative filtering + Content-based filtering
    const recommendations = await this.hybridRecommendation(userId, limit);
    return recommendations;
  }

  async updateUserProfile(userId: string, interactions: any[]): Promise<void> {
    const profile = this.userProfiles.get(userId) || { preferences: {}, history: [] };
    
    // Update user preferences based on interactions
    for (const interaction of interactions) {
      profile.history.push(interaction);
      this.updatePreferences(profile.preferences, interaction);
    }
    
    this.userProfiles.set(userId, profile);
  }

  private async hybridRecommendation(userId: string, limit: number): Promise<any[]> {
    const collaborative = await this.collaborativeFiltering(userId, limit);
    const contentBased = await this.contentBasedFiltering(userId, limit);
    
    // Combine recommendations with weights
    return this.combineRecommendations(collaborative, contentBased, limit);
  }

  private async collaborativeFiltering(userId: string, limit: number): Promise<any[]> {
    // Find similar users and recommend their liked items
    return [
      { itemId: 'item1', score: 0.95, reason: 'Users like you also liked this' },
      { itemId: 'item2', score: 0.87, reason: 'Popular among similar users' }
    ];
  }

  private async contentBasedFiltering(userId: string, limit: number): Promise<any[]> {
    // Recommend items similar to user's preferences
    return [
      { itemId: 'item3', score: 0.92, reason: 'Similar to your interests' },
      { itemId: 'item4', score: 0.84, reason: 'Matches your preferences' }
    ];
  }

  private combineRecommendations(collab: any[], content: any[], limit: number): any[] {
    // Weighted combination of recommendations
    const combined = [...collab, ...content];
    return combined.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  private getPopularItems(limit: number): any[] {
    // Return popular items for new users
    return [
      { itemId: 'popular1', score: 0.9, reason: 'Trending now' },
      { itemId: 'popular2', score: 0.85, reason: 'Most popular' }
    ];
  }

  private updatePreferences(preferences: any, interaction: any): void {
    // Update user preferences based on interaction
    const category = interaction.category;
    preferences[category] = (preferences[category] || 0) + interaction.rating;
  }
}