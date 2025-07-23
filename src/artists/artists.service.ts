import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist = this.artistRepository.create(createArtistDto);
    return await this.artistRepository.save(artist);
  }

  async findAll(): Promise<Artist[]> {
    return await this.artistRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Artist> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return artist;
  }

  async findByUserId(userId: number): Promise<Artist> {
    // Note: This assumes there's a userId field or relationship
    // For now, we'll search by email or implement user relationship later
    throw new NotFoundException('Method not implemented - requires user relationship');
  }

  async findBySpecialty(specialty: string): Promise<Artist[]> {
    return await this.artistRepository
      .createQueryBuilder('artist')
      .where('artist.specialties LIKE :specialty', { specialty: `%${specialty}%` })
      .orderBy('artist.experienceYears', 'DESC')
      .getMany();
  }

  async findByExperience(minYears: number): Promise<Artist[]> {
    return await this.artistRepository
      .createQueryBuilder('artist')
      .where('artist.experienceYears >= :minYears', { minYears })
      .orderBy('artist.experienceYears', 'DESC')
      .getMany();
  }

  async findAvailable(): Promise<Artist[]> {
    return await this.artistRepository.find({
      where: { isActive: true },
      order: { experienceYears: 'DESC' },
    });
  }

  async findFeatured(): Promise<Artist[]> {
    // For now, return artists with highest rating
    return await this.artistRepository
      .createQueryBuilder('artist')
      .where('artist.rating >= :minRating', { minRating: 4.5 })
      .orderBy('artist.rating', 'DESC')
      .limit(10)
      .getMany();
  }

  async update(id: number, updateArtistDto: UpdateArtistDto, user: any): Promise<Artist> {
    const artist = await this.findOne(id);
    
    // Check if user can update this artist profile
    // Note: This would need proper user-artist relationship
    if (user.role === 'artist' && artist.email !== user.email) {
      throw new ForbiddenException('You can only update your own artist profile');
    }
    
    await this.artistRepository.update(id, updateArtistDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const artist = await this.findOne(id);
    await this.artistRepository.delete(id);
  }

  async toggleAvailability(id: number, user: any): Promise<Artist> {
    const artist = await this.findOne(id);
    
    // Check if user can toggle availability
    if (user.role === 'artist' && artist.email !== user.email) {
      throw new ForbiddenException('You can only toggle your own availability');
    }
    
    await this.artistRepository.update(id, { isActive: !artist.isActive });
    return await this.findOne(id);
  }

  async getPortfolioSummary(id: number): Promise<any> {
    const artist = await this.findOne(id);
    
    const portfolioImages = artist.portfolioImages ? JSON.parse(artist.portfolioImages) : [];
    
    return {
      artistId: artist.id,
      name: artist.name,
      specialties: artist.specialties ? JSON.parse(artist.specialties) : [],
      experienceYears: artist.experienceYears,
      portfolioCount: portfolioImages.length,
      isActive: artist.isActive,
      rating: artist.rating,
      totalReviews: artist.totalReviews,
      hourlyRate: artist.hourlyRate,
    };
  }
}
