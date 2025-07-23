import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistsService.create(createArtistDto);
  }

  @Get()
  @Public()
  findAll(@Query('specialty') specialty?: string, @Query('experience') experience?: string) {
    if (specialty) {
      return this.artistsService.findBySpecialty(specialty);
    }
    if (experience) {
      return this.artistsService.findByExperience(parseInt(experience));
    }
    return this.artistsService.findAll();
  }

  @Get('available')
  @Public()
  findAvailable() {
    return this.artistsService.findAvailable();
  }

  @Get('featured')
  @Public()
  findFeatured() {
    return this.artistsService.findFeatured();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('artist')
  getMyProfile(@GetUser('id') userId: number) {
    return this.artistsService.findByUserId(userId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.artistsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'artist')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateArtistDto: UpdateArtistDto, @GetUser() user: any) {
    return this.artistsService.update(id, updateArtistDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.artistsService.remove(id);
  }

  @Patch(':id/toggle-availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('artist', 'admin')
  toggleAvailability(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
    return this.artistsService.toggleAvailability(id, user);
  }

  @Get(':id/portfolio-summary')
  @Public()
  getPortfolioSummary(@Param('id', ParseIntPipe) id: number) {
    return this.artistsService.getPortfolioSummary(id);
  }
}
