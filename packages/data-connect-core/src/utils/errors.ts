export class DataConnectError extends Error {
  public code: string;
  public details?: any;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', details?: any) {
    super(message);
    this.name = 'DataConnectError';
    this.code = code;
    this.details = details;
  }

  static fromGraphQLError(error: any): DataConnectError {
    return new DataConnectError(
      error.message || 'GraphQL Error',
      error.extensions?.code || 'GRAPHQL_ERROR',
      error
    );
  }

  static networkError(message: string): DataConnectError {
    return new DataConnectError(message, 'NETWORK_ERROR');
  }

  static validationError(message: string, details?: any): DataConnectError {
    return new DataConnectError(message, 'VALIDATION_ERROR', details);
  }

  static notFoundError(resource: string, id: string): DataConnectError {
    return new DataConnectError(
      `${resource} with id ${id} not found`,
      'NOT_FOUND'
    );
  }

  static permissionError(action: string, resource: string): DataConnectError {
    return new DataConnectError(
      `Permission denied for ${action} on ${resource}`,
      'PERMISSION_DENIED'
    );
  }
}