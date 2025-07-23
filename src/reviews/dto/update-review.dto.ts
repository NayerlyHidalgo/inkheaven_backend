import { IsOptional, IsIn, IsString } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected'])
  status?: string;

  @IsOptional()
  @IsString()
  moderatorNotes?: string;

  @IsOptional()
  isFeatured?: boolean;
}
