import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { SchedulingService } from './scheduling/scheduling.service';
import { ArtistsModule } from '../artists/artists.module';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    ArtistsModule,
    UsersModule,
    ProductsModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, SchedulingService],
  exports: [AppointmentsService, SchedulingService, TypeOrmModule],
})
export class AppointmentsModule {}
