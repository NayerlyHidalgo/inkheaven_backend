import { IsOptional, IsString, IsBoolean, IsIn, IsNumber, IsArray } from 'class-validator';

export class UpdatePortfolioDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

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
  isFeatured?: boolean;

  @IsOptional()
  @IsIn(['draft', 'published', 'archived'])
  status?: string;

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
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  metadata?: Record<string, any>;
}
