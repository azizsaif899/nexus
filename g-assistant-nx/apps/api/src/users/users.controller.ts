import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService, User } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  findAll() {
    return {
      success: true,
      data: this.usersService.findAll(),
      count: this.usersService.findAll().length
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    const user = this.usersService.findOne(+id);
    
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    return {
      success: true,
      data: user
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  create(@Body() userData: Partial<User>) {
    const newUser = this.usersService.create(userData);
    
    return {
      success: true,
      message: 'User created successfully',
      data: newUser
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() userData: Partial<User>) {
    const updatedUser = this.usersService.update(+id, userData);
    
    if (!updatedUser) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    return {
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    const deleted = this.usersService.remove(+id);
    
    if (!deleted) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    return {
      success: true,
      message: 'User deleted successfully'
    };
  }
}