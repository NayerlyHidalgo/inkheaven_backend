import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles('client', 'admin')
  @UseGuards(RolesGuard)
  create(@Body() createAppointmentDto: CreateAppointmentDto, @GetUser('id') userId: number) {
    return this.appointmentsService.create(createAppointmentDto, userId);
  }

  @Get()
  @Roles('admin')
  @UseGuards(RolesGuard)
  findAll(@Query('status') status?: string, @Query('artistId') artistId?: string, @Query('userId') userId?: string) {
    return this.appointmentsService.findAll({
      status,
      artistId: artistId ? parseInt(artistId) : undefined,
      userId: userId ? parseInt(userId) : undefined,
    });
  }

  @Get('my-appointments')
  getMyAppointments(@GetUser('id') userId: number, @GetUser('role') role: string) {
    if (role === 'artist') {
      return this.appointmentsService.findByArtist(userId);
    }
    return this.appointmentsService.findByUser(userId);
  }

  @Get('upcoming')
  getUpcomingAppointments(@GetUser('id') userId: number, @GetUser('role') role: string) {
    if (role === 'artist') {
      return this.appointmentsService.findUpcomingByArtist(userId);
    }
    return this.appointmentsService.findUpcomingByUser(userId);
  }

  @Get('artist/:artistId')
  @Roles('admin', 'artist')
  @UseGuards(RolesGuard)
  findByArtist(@Param('artistId', ParseIntPipe) artistId: number, @GetUser() user: any) {
    return this.appointmentsService.findByArtist(artistId, user);
  }

  @Get('user/:userId')
  @Roles('admin')
  @UseGuards(RolesGuard)
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.appointmentsService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
    return this.appointmentsService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAppointmentDto: UpdateAppointmentDto, @GetUser() user: any) {
    return this.appointmentsService.update(id, updateAppointmentDto, user);
  }

  @Patch(':id/status')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: string, @GetUser() user: any) {
    return this.appointmentsService.updateStatus(id, status, user);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.remove(id);
  }

  @Delete(':id/cancel')
  cancelAppointment(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
    return this.appointmentsService.cancelAppointment(id, user);
  }

  @Get('availability/:artistId/:date')
  getArtistAvailability(@Param('artistId', ParseIntPipe) artistId: number, @Param('date') date: string) {
    return this.appointmentsService.getArtistAvailability(artistId, new Date(date));
  }
}
