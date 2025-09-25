import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  @Get('active')
  async getActiveSessions(@Request() req) {
    return { activeSessions: [], userId: req.user.id };
  }

  @Post(':sessionId/activate')
  async activateSession(@Param('sessionId') sessionId: string, @Request() req) {
    return { sessionId, status: 'activated', userId: req.user.id };
  }

  @Put(':sessionId/deactivate')
  async deactivateSession(@Param('sessionId') sessionId: string, @Request() req) {
    return { sessionId, status: 'deactivated', userId: req.user.id };
  }

  @Get(':sessionId/status')
  async getSessionStatus(@Param('sessionId') sessionId: string, @Request() req) {
    return { sessionId, status: 'active', userId: req.user.id };
  }

  @Delete(':sessionId/cleanup')
  async cleanupSession(@Param('sessionId') sessionId: string, @Request() req) {
    return { sessionId, status: 'cleaned', userId: req.user.id };
  }
}