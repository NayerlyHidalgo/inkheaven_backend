import { IsString, IsNumber, IsOptional, IsArray, Min, Max, IsDateString, IsIn, IsBoolean } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  userId: number;

  @IsString()
  userName: string;

  @IsString()
  userEmail: string;

  @IsNumber()
  artistId: number;

  @IsString()
  artistName: string;

  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsOptional()
  @IsNumber()
  appointmentId?: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsDateString()
  serviceDate?: string;

  @IsOptional()
  @IsIn(['design', 'artist', 'overall'])
  reviewType?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
