import { Controller, Get, UseGuards, Param, Patch, Body, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getOwnProfile(@GetUser('id') userId: number) {
    return await this.usersService.findById(userId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAllUsers() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateData: any) {
    return await this.usersService.updateUser(id, updateData);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async deactivateUser(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.deactivateUser(id);
    return { message: 'User deactivated successfully' };
  }
}
