import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() userData: any) {
    try {
      const userId = await this.usersService.create(userData);
      return { 
        success: true, 
        id: userId, 
        message: 'User created successfully',
        data: { id: userId, ...userData }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        statusCode: 400
      };
    }
  }

  @Get()
  async getAllUsers() {
    try {
      const users = await this.usersService.getAllUsers();
      return { success: true, data: users, count: users.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(id);
      return { 
        success: true, 
        data: user,
        message: 'User retrieved successfully'
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        statusCode: error.message === 'User not found' ? 404 : 400
      };
    }
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() userData: any) {
    try {
      const updatedUser = await this.usersService.updateUser(id, userData);
      return { success: true, data: updatedUser, message: 'User updated successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      await this.usersService.deleteUser(id);
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}