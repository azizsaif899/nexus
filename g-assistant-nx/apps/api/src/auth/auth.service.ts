import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly users = [
    { id: 1, username: 'admin', password: '$2b$10$rQZ8kHqZ8kHqZ8kHqZ8kHO', role: 'admin' },
    { id: 2, username: 'user', password: '$2b$10$rQZ8kHqZ8kHqZ8kHqZ8kHO', role: 'user' }
  ];

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    
    const user = await this.validateUser(username, password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    
    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      token,
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '24h')
    };
  }

  async logout() {
    return {
      success: true,
      message: 'Logout successful'
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return {
        success: true,
        message: 'Token is valid',
        user: {
          id: payload.sub,
          username: payload.username,
          role: payload.role
        }
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async validateUser(username: string, password: string) {
    // Simple validation for demo (replace with real password check)
    if (username === 'admin' && password === 'azizsys2025') {
      return { id: 1, username: 'admin', role: 'admin' };
    }
    if (username === 'user' && password === 'user123') {
      return { id: 2, username: 'user', role: 'user' };
    }
    return null;
  }
}
