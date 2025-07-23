import { IsString, IsEmail, IsOptional, IsNumber, IsDateString, IsBoolean, IsPositive, Min, Max } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  clientName: string;

  @IsEmail()
  clientEmail: string;

  @IsString()
  clientPhone: string;

  @IsNumber()
  @IsPositive()
  artistId: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  productId?: number;

  @IsDateString()
  appointmentDate: Date;

  @IsString()
  startTime: string; // Format: "HH:mm"

  @IsString()
  endTime: string; // Format: "HH:mm"

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(8)
  estimatedDuration?: number; // in hours

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  tattooDescription?: string;

  @IsOptional()
  @IsString()
  bodyPart?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  estimatedPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  deposit?: number;

  @IsOptional()
  @IsBoolean()
  isFirstSession?: boolean;

  @IsOptional()
  @IsString()
  referenceImageUrl?: string;
}
