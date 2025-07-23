import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';

@Injectable()
export class SchedulingService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async getArtistAvailability(artistId: number, date: Date): Promise<string[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await this.appointmentRepository.find({
      where: {
        artistId,
        appointmentDate: Between(startOfDay, endOfDay),
        status: 'scheduled',
      },
    });

    // Logic to calculate available time slots
    // This is a simplified version - in a real app you'd implement more complex scheduling logic
    const busySlots = appointments.map(apt => ({
      start: apt.startTime,
      end: apt.endTime,
    }));

    // Return available time slots (simplified example)
    const allSlots = [
      '09:00', '10:00', '11:00', '12:00', '13:00', 
      '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    return allSlots; // In real implementation, filter out busy slots
  }

  async checkTimeSlotAvailable(
    artistId: number, 
    date: Date, 
    startTime: string, 
    duration: number
  ): Promise<boolean> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const conflictingAppointments = await this.appointmentRepository.count({
      where: {
        artistId,
        appointmentDate: Between(startOfDay, endOfDay),
        status: 'scheduled',
      },
    });

    // Simplified check - in real implementation, check for actual time conflicts
    return conflictingAppointments === 0;
  }

  async getArtistSchedule(artistId: number, startDate: Date, endDate: Date): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: {
        artistId,
        appointmentDate: Between(startDate, endDate),
      },
      order: {
        appointmentDate: 'ASC',
        startTime: 'ASC',
      },
    });
  }
}
