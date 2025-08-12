import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class SessionService {
  private activeSessions = new Map<string, any>();
  private refreshTokens = new Map<string, string>();

  constructor(private jwtService: JwtService) {}

  async createSession(userId: string, userRole: string): Promise<any> {
    const sessionId = crypto.randomUUID();
    const accessToken = this.jwtService.sign(
      { userId, role: userRole, sessionId },
      { expiresIn: '15m' }
    );
    
    const refreshToken = crypto.randomBytes(32).toString('hex');
    
    const session = {
      userId,
      role: userRole,
      sessionId,
      createdAt: new Date(),
      lastActivity: new Date(),
      isActive: true
    };
    
    this.activeSessions.set(sessionId, session);
    this.refreshTokens.set(refreshToken, sessionId);
    
    return { accessToken, refreshToken, sessionId };
  }

  async refreshSession(refreshToken: string): Promise<any> {
    const sessionId = this.refreshTokens.get(refreshToken);
    if (!sessionId) {
      throw new Error('Invalid refresh token');
    }
    
    const session = this.activeSessions.get(sessionId);
    if (!session || !session.isActive) {
      throw new Error('Session expired');
    }
    
    // Generate new tokens
    const newAccessToken = this.jwtService.sign(
      { userId: session.userId, role: session.role, sessionId },
      { expiresIn: '15m' }
    );
    
    const newRefreshToken = crypto.randomBytes(32).toString('hex');
    
    // Update session
    session.lastActivity = new Date();
    this.refreshTokens.delete(refreshToken);
    this.refreshTokens.set(newRefreshToken, sessionId);
    
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async invalidateSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.isActive = false;
    }
    
    // Remove refresh token
    for (const [token, id] of this.refreshTokens.entries()) {
      if (id === sessionId) {
        this.refreshTokens.delete(token);
        break;
      }
    }
  }

  async validateSession(sessionId: string): Promise<boolean> {
    const session = this.activeSessions.get(sessionId);
    return session && session.isActive;
  }
}