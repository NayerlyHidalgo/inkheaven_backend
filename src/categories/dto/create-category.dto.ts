import { IsString, IsOptional, IsBoolean, IsNumber, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icono?: string;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  orden?: number;
}
