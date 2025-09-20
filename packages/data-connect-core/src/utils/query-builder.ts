export class QueryBuilder {
  private query: string = '';
  private variables: Record<string, any> = {};

  static create(): QueryBuilder {
    return new QueryBuilder();
  }

  select(fields: string[]): QueryBuilder {
    this.query += `{\n  ${fields.join('\n  ')}\n}`;
    return this;
  }

  where(field: string, operator: string, value: any): QueryBuilder {
    this.variables[field] = value;
    return this;
  }

  limit(count: number): QueryBuilder {
    this.variables.limit = count;
    return this;
  }

  offset(count: number): QueryBuilder {
    this.variables.offset = count;
    return this;
  }

  build(): { query: string; variables: Record<string, any> } {
    return {
      query: this.query,
      variables: this.variables
    };
  }

  // Helper methods for common queries
  static getDashboard(): { query: string; variables: Record<string, any> } {
    return QueryBuilder.create()
      .select([
        'totalCustomers',
        'activeCustomers',
        'totalLeads',
        'qualifiedLeads',
        'totalRevenue',
        'conversionRate'
      ])
      .build();
  }

  static getCustomers(limit = 10, offset = 0): { query: string; variables: Record<string, any> } {
    return QueryBuilder.create()
      .select([
        'id',
        'name',
        'email',
        'company',
        'value',
        'status',
        'createdAt'
      ])
      .limit(limit)
      .offset(offset)
      .build();
  }

  static getLeads(stage?: string, limit = 10): { query: string; variables: Record<string, any> } {
    const builder = QueryBuilder.create()
      .select([
        'id',
        'name',
        'email',
        'company',
        'score',
        'stage',
        'expectedValue',
        'createdAt'
      ])
      .limit(limit);

    if (stage) {
      builder.where('stage', 'EQUALS', stage);
    }

    return builder.build();
  }
}