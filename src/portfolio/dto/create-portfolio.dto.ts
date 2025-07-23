import { IsString, IsArray, IsOptional, IsNumber, IsDateString, IsBoolean, IsIn, Min, Max } from 'class-validator';

export class CreatePortfolioDto {
  @IsNumber()
  artistId: number;

  @IsString()
  artistName: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsOptional()
  @IsNumber()
  clientId?: number;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsNumber()
  appointmentId?: number;

  @IsString()
  style: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  bodyPart?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(48)
  duration?: number;

  @IsOptional()
  @IsDateString()
  completionDate?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsIn(['draft', 'published', 'archived'])
  status?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techniques?: string[];

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  beforeAndAfter?: {
    beforeImage?: string;
    afterImage: string;
    healingStages?: string[];
  };

  @IsOptional()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  awards?: string[];

  @IsOptional()
  @IsString()
  inspirationSource?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
