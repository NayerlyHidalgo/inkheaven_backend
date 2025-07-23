import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, userId: number): Promise<Appointment> {
    // Check if the appointment time is available
    const existingAppointment = await this.appointmentRepository.findOne({
      where: {
        artistId: createAppointmentDto.artistId,
        appointmentDate: createAppointmentDto.appointmentDate,
        startTime: createAppointmentDto.startTime,
        status: 'scheduled',
      },
    });

    if (existingAppointment) {
      throw new BadRequestException('This time slot is already booked');
    }

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      clientId: userId,
    });
    
    return await this.appointmentRepository.save(appointment);
  }

  async findAll(filters?: any): Promise<Appointment[]> {
    const query = this.appointmentRepository.createQueryBuilder('appointment');
    
    if (filters?.status) {
      query.andWhere('appointment.status = :status', { status: filters.status });
    }
    
    if (filters?.artistId) {
      query.andWhere('appointment.artistId = :artistId', { artistId: filters.artistId });
    }
    
    if (filters?.userId) {
      query.andWhere('appointment.clientId = :clientId', { clientId: filters.userId });
    }
    
    return query
      .orderBy('appointment.appointmentDate', 'DESC')
      .addOrderBy('appointment.startTime', 'ASC')
      .getMany();
  }

  async findOne(id: number, user?: any): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    // Check if user has permission to view this appointment
    if (user && user.role !== 'admin' && appointment.clientId !== user.id && appointment.artistId !== user.id) {
      throw new ForbiddenException('You can only view your own appointments');
    }
    
    return appointment;
  }

  async findByUser(userId: number): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: { clientId: userId },
      order: { appointmentDate: 'DESC', startTime: 'ASC' },
    });
  }

  async findByArtist(artistId: number, user?: any): Promise<Appointment[]> {
    // If user is an artist, they can only see their own appointments
    if (user && user.role === 'artist' && artistId !== user.id) {
      throw new ForbiddenException('You can only view your own appointments');
    }

    return await this.appointmentRepository.find({
      where: { artistId },
      order: { appointmentDate: 'DESC', startTime: 'ASC' },
    });
  }

  async findUpcomingByUser(userId: number): Promise<Appointment[]> {
    const today = new Date();
    return await this.appointmentRepository.find({
      where: { 
        clientId: userId,
        appointmentDate: MoreThan(today),
        status: 'scheduled',
      },
      order: { appointmentDate: 'ASC', startTime: 'ASC' },
    });
  }

  async findUpcomingByArtist(artistId: number): Promise<Appointment[]> {
    const today = new Date();
    return await this.appointmentRepository.find({
      where: { 
        artistId,
        appointmentDate: MoreThan(today),
        status: 'scheduled',
      },
      order: { appointmentDate: 'ASC', startTime: 'ASC' },
    });
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto, user: any): Promise<Appointment> {
    const appointment = await this.findOne(id, user);
    
    // Only admin, the client who booked, or the artist can update
    if (user.role !== 'admin' && appointment.clientId !== user.id && appointment.artistId !== user.id) {
      throw new ForbiddenException('You can only update your own appointments');
    }
    
    await this.appointmentRepository.update(id, updateAppointmentDto);
    return await this.findOne(id);
  }

  async updateStatus(id: number, status: string, user: any): Promise<Appointment> {
    const appointment = await this.findOne(id, user);
    
    // Only admin or the artist can update appointment status
    if (user.role !== 'admin' && appointment.artistId !== user.id) {
      throw new ForbiddenException('Only the assigned artist or admin can update appointment status');
    }
    
    await this.appointmentRepository.update(id, { status });
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.delete(id);
  }

  async cancelAppointment(id: number, user: any): Promise<Appointment> {
    const appointment = await this.findOne(id, user);
    
    // Only the client who booked or admin can cancel
    if (user.role !== 'admin' && appointment.clientId !== user.id) {
      throw new ForbiddenException('You can only cancel your own appointments');
    }
    
    // Check if appointment can be cancelled (e.g., at least 24 hours notice)
    const appointmentDateTime = new Date(`${appointment.appointmentDate}T${appointment.startTime}`);
    const now = new Date();
    const hoursUntilAppointment = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilAppointment < 24) {
      throw new BadRequestException('Appointments can only be cancelled with at least 24 hours notice');
    }
    
    await this.appointmentRepository.update(id, { status: 'cancelled' });
    return await this.findOne(id);
  }

  async getArtistAvailability(artistId: number, date: Date): Promise<string[]> {
    const appointments = await this.appointmentRepository.find({
      where: {
        artistId,
        appointmentDate: date,
        status: 'scheduled',
      },
    });

    // Default working hours (9 AM to 6 PM)
    const workingHours = [
      '09:00', '10:00', '11:00', '12:00', '13:00', 
      '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    // Filter out booked times
    const bookedTimes = appointments.map(apt => apt.startTime);
    return workingHours.filter(time => !bookedTimes.includes(time));
  }
}
