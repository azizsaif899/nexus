export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export class AuthService {
  private users = new Map<string, User>();
  private tokens = new Map<string, string>();

  async login(email: string, password: string): Promise<AuthResult> {
    // Removed console.log
    
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      username: email.split('@')[0],
      role: 'user'
    };

    const token = this.generateToken(user.id);
    this.users.set(user.id, user);
    this.tokens.set(token, user.id);

    return {
      success: true,
      user,
      token,
      message: 'تم تسجيل الدخول بنجاح'
    };
  }

  async validateToken(token: string): Promise<User | null> {
    const userId = this.tokens.get(token);
    if (userId) {
      return this.users.get(userId) || null;
    }
    return null;
  }

  private generateToken(userId: string): string {
    return `token_${userId}_${Date.now()}`;
  }
}