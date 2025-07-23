import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsOptional()
  @IsString()
  @IsIn(['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'rescheduled'])
  status?: string;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'deposit-paid', 'fully-paid'])
  paymentStatus?: string;
}
