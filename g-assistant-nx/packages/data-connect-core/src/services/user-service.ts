import { getDataConnect } from '../client';

export class UserService {
  private dataConnect = getDataConnect();

  async getUsers(filter?: any, limit?: number, offset?: number) {
    const result = await this.dataConnect.query(`
      query GetUsers($filter: UserFilter, $limit: Int, $offset: Int) {
        users(filter: $filter, limit: $limit, offset: $offset) {
          id
          email
          name
          role
          status
          createdAt
        }
      }
    `, { filter, limit, offset });
    return result.users;
  }

  async getCurrentUser() {
    const result = await this.dataConnect.query(`
      query GetCurrentUser {
        currentUser {
          id
          email
          name
          role
          status
          permissions {
            resource
            permission
            granted
          }
        }
      }
    `);
    return result.currentUser;
  }

  async createUser(input: any) {
    const result = await this.dataConnect.mutate(`
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          id
          email
          name
          role
          status
          createdAt
        }
      }
    `, { input });
    return result.createUser;
  }
}

let userService: UserService | null = null;

export function getUserService(): UserService {
  if (!userService) {
    userService = new UserService();
  }
  return userService;
}