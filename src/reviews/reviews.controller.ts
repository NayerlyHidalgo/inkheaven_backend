import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createReviewDto: CreateReviewDto, @GetUser('id') userId: number) {
    // Ensure the review is created by the authenticated user
    createReviewDto.userId = userId;
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  findAll(@Query() filters: any) {
    return this.reviewsService.findAll(filters);
  }

  @Get('featured')
  getFeaturedReviews() {
    return this.reviewsService.getFeaturedReviews();
  }

  @Get('artist/:artistId')
  findByArtist(@Param('artistId', ParseIntPipe) artistId: number) {
    return this.reviewsService.findByArtist(artistId);
  }

  @Get('artist/:artistId/stats')
  getArtistStats(@Param('artistId', ParseIntPipe) artistId: number) {
    return this.reviewsService.getArtistStats(artistId);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findByUser(@Param('userId', ParseIntPipe) userId: number, @GetUser('id') requestUserId: number) {
    // Users can only see their own reviews unless they're admin
    if (userId !== requestUserId) {
      // Add role check here if needed
    }
    return this.reviewsService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Patch(':id/moderate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  moderateReview(
    @Param('id') id: string,
    @Body() body: { status: string; moderatorNotes?: string }
  ) {
    return this.reviewsService.moderateReview(id, body.status, body.moderatorNotes);
  }

  @Patch(':id/toggle-featured')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  toggleFeatured(@Param('id') id: string) {
    return this.reviewsService.toggleFeatured(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
