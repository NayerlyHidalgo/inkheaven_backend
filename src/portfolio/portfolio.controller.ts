import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('artist', 'admin')
  create(@Body() createPortfolioDto: CreatePortfolioDto, @GetUser() user: any) {
    // Ensure the portfolio is created by the authenticated artist
    if (user.role === 'artist') {
      createPortfolioDto.artistId = user.id;
      createPortfolioDto.artistName = user.name;
    }
    return this.portfolioService.create(createPortfolioDto);
  }

  @Get()
  findAll(@Query() filters: any) {
    return this.portfolioService.findPublic(filters);
  }

  @Get('featured')
  getFeaturedWorks() {
    return this.portfolioService.getFeaturedWorks();
  }

  @Get('popular')
  getPopularWorks() {
    return this.portfolioService.getPopularWorks();
  }

  @Get('search')
  searchWorks(@Query('q') searchTerm: string) {
    return this.portfolioService.searchWorks(searchTerm);
  }

  @Get('style/:style')
  getWorksByStyle(@Param('style') style: string) {
    return this.portfolioService.getWorksByStyle(style);
  }

  @Get('artist/:artistId')
  findByArtist(@Param('artistId', ParseIntPipe) artistId: number, @Query('includePrivate') includePrivate?: string) {
    return this.portfolioService.findByArtist(artistId, includePrivate === 'true');
  }

  @Get('artist/:artistId/stats')
  getArtistStats(@Param('artistId', ParseIntPipe) artistId: number) {
    return this.portfolioService.getArtistStats(artistId);
  }

  @Get('my-portfolio')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('artist')
  getMyPortfolio(@GetUser('id') artistId: number) {
    return this.portfolioService.findByArtist(artistId, true);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Increment views when someone views a portfolio item
    return this.portfolioService.incrementViews(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('artist', 'admin')
  update(
    @Param('id') id: string, 
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @GetUser() user: any
  ) {
    const artistId = user.role === 'artist' ? user.id : undefined;
    return this.portfolioService.update(id, updatePortfolioDto, artistId);
  }

  @Patch(':id/like')
  likePortfolio(@Param('id') id: string) {
    return this.portfolioService.incrementLikes(id);
  }

  @Patch(':id/unlike')
  unlikePortfolio(@Param('id') id: string) {
    return this.portfolioService.decrementLikes(id);
  }

  @Patch(':id/toggle-featured')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  toggleFeatured(@Param('id') id: string) {
    return this.portfolioService.toggleFeatured(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('artist', 'admin')
  remove(@Param('id') id: string, @GetUser() user: any) {
    const artistId = user.role === 'artist' ? user.id : undefined;
    return this.portfolioService.remove(id, artistId);
  }
}
