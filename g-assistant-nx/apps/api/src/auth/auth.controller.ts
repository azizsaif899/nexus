import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticate user with username and password. Returns JWT token on success.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    example: {
      success: true,
      message: 'Login successful',
      user: { id: 1, username: 'admin', role: 'admin' },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      expiresIn: '24h'
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials',
    example: {
      success: false,
      statusCode: 401,
      message: 'Invalid credentials',
      timestamp: '2025-01-09T14:30:00.000Z'
    }
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout() {
    return this.authService.logout();
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate token' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  async validateToken(@Body() body: { token: string }) {
    return this.authService.validateToken(body.token);
  }
}
