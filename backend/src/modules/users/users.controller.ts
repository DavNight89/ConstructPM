import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from '../../database/entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
// @UseGuards(JwtAuthGuard) // Uncomment when auth is ready
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'status', required: false, enum: UserStatus })
  @ApiResponse({ status: 200, description: 'List of users' })
  async findAll(
    @Query('role') role?: string,
    @Query('status') status?: UserStatus,
  ) {
    return this.usersService.findAll({ role, status });
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({ status: 200, description: 'User statistics' })
  async getStatistics() {
    return this.usersService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'User deactivated successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { message: 'User deactivated successfully' };
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Permanently delete a user' })
  @ApiResponse({
    status: 200,
    description: 'User permanently deleted',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async hardDelete(@Param('id') id: string) {
    await this.usersService.hardDelete(id);
    return { message: 'User permanently deleted' };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update user status' })
  @ApiResponse({ status: 200, description: 'User status updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: UserStatus,
  ) {
    return this.usersService.updateStatus(id, status);
  }

  @Post(':id/change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async changePassword(
    @Param('id') id: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.usersService.changePassword(id, newPassword);
    return { message: 'Password changed successfully' };
  }
}
