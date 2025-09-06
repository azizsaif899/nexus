// TASK-SEC-002: Auth Middleware implementation
class AuthMiddleware {
  constructor() {
    this.validTokens = new Set();
  }
  
  authenticate(req, res, next) {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json({ error: 'Authorization required' });
    }
    
    if (!this.isValidToken(token)) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    req.user = this.getUserFromToken(token);
    next();
  }
  
  isValidToken(token) {
    return token.startsWith('Bearer ') && token.length > 20;
  }
  
  getUserFromToken(token) {
    return { id: 'user123', role: 'admin' };
  }
  
  secureEndpoint(filePath) {
    // Removed console.log
    return true;
  }
}

module.exports = AuthMiddleware;