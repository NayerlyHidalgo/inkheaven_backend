import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Portfolio, PortfolioDocument } from './schemas/portfolio.schema';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Portfolio.name) private portfolioModel: Model<PortfolioDocument>,
  ) {}

  async create(createPortfolioDto: CreatePortfolioDto): Promise<Portfolio> {
    const createdPortfolio = new this.portfolioModel(createPortfolioDto);
    return createdPortfolio.save();
  }

  async findAll(filters?: any): Promise<Portfolio[]> {
    const query = this.portfolioModel.find();
    
    if (filters) {
      if (filters.artistId) query.where('artistId').equals(filters.artistId);
      if (filters.style) query.where('style').equals(filters.style);
      if (filters.bodyPart) query.where('bodyPart').equals(filters.bodyPart);
      if (filters.status) query.where('status').equals(filters.status);
      if (filters.isFeatured !== undefined) query.where('isFeatured').equals(filters.isFeatured);
      if (filters.isPublic !== undefined) query.where('isPublic').equals(filters.isPublic);
      if (filters.size) query.where('size').equals(filters.size);
      if (filters.difficulty) query.where('difficulty').equals(filters.difficulty);
      if (filters.tags && filters.tags.length > 0) {
        query.where('tags').in(filters.tags);
      }
    }

    return query.sort({ createdAt: -1 }).exec();
  }

  async findPublic(filters?: any): Promise<Portfolio[]> {
    const publicFilters = { ...filters, isPublic: true, status: 'published' };
    return this.findAll(publicFilters);
  }

  async findOne(id: string): Promise<Portfolio> {
    const portfolio = await this.portfolioModel.findById(id).exec();
    if (!portfolio) {
      throw new NotFoundException('Portfolio item not found');
    }
    return portfolio;
  }

  async findByArtist(artistId: number, includePrivate: boolean = false): Promise<Portfolio[]> {
    const filters: any = { artistId };
    
    if (!includePrivate) {
      filters.isPublic = true;
      filters.status = 'published';
    }

    return this.findAll(filters);
  }

  async getFeaturedWorks(): Promise<Portfolio[]> {
    return this.portfolioModel
      .find({ isFeatured: true, isPublic: true, status: 'published' })
      .sort({ createdAt: -1 })
      .limit(12)
      .exec();
  }

  async getPopularWorks(): Promise<Portfolio[]> {
    return this.portfolioModel
      .find({ isPublic: true, status: 'published' })
      .sort({ likes: -1, views: -1 })
      .limit(20)
      .exec();
  }

  async getWorksByStyle(style: string): Promise<Portfolio[]> {
    return this.portfolioModel
      .find({ style, isPublic: true, status: 'published' })
      .sort({ createdAt: -1 })
      .exec();
  }

  async searchWorks(searchTerm: string): Promise<Portfolio[]> {
    return this.portfolioModel
      .find({
        $and: [
          { isPublic: true, status: 'published' },
          {
            $or: [
              { title: { $regex: searchTerm, $options: 'i' } },
              { description: { $regex: searchTerm, $options: 'i' } },
              { tags: { $in: [new RegExp(searchTerm, 'i')] } },
              { style: { $regex: searchTerm, $options: 'i' } },
              { bodyPart: { $regex: searchTerm, $options: 'i' } }
            ]
          }
        ]
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async incrementViews(id: string): Promise<Portfolio> {
    const portfolio = await this.portfolioModel
      .findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
      .exec();
    
    if (!portfolio) {
      throw new NotFoundException('Portfolio item not found');
    }
    
    return portfolio;
  }

  async incrementLikes(id: string): Promise<Portfolio> {
    const portfolio = await this.portfolioModel
      .findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true })
      .exec();
    
    if (!portfolio) {
      throw new NotFoundException('Portfolio item not found');
    }
    
    return portfolio;
  }

  async decrementLikes(id: string): Promise<Portfolio> {
    const portfolio = await this.portfolioModel
      .findByIdAndUpdate(id, { $inc: { likes: -1 } }, { new: true })
      .exec();
    
    if (!portfolio) {
      throw new NotFoundException('Portfolio item not found');
    }
    
    return portfolio;
  }

  async update(id: string, updatePortfolioDto: UpdatePortfolioDto, artistId?: number): Promise<Portfolio> {
    const portfolio = await this.findOne(id);
    
    // Check if the user has permission to update this portfolio item
    if (artistId && portfolio.artistId !== artistId) {
      throw new ForbiddenException('You can only update your own portfolio items');
    }

    const updatedPortfolio = await this.portfolioModel
      .findByIdAndUpdate(id, updatePortfolioDto, { new: true })
      .exec();
    
    if (!updatedPortfolio) {
      throw new NotFoundException('Portfolio item not found');
    }
    
    return updatedPortfolio;
  }

  async remove(id: string, artistId?: number): Promise<void> {
    const portfolio = await this.findOne(id);
    
    // Check if the user has permission to delete this portfolio item
    if (artistId && portfolio.artistId !== artistId) {
      throw new ForbiddenException('You can only delete your own portfolio items');
    }

    const result = await this.portfolioModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Portfolio item not found');
    }
  }

  async toggleFeatured(id: string): Promise<Portfolio> {
    const portfolio = await this.findOne(id);
    return this.update(id, { isFeatured: !portfolio.isFeatured });
  }

  async getArtistStats(artistId: number): Promise<any> {
    const stats = await this.portfolioModel.aggregate([
      { $match: { artistId, status: 'published' } },
      {
        $group: {
          _id: null,
          totalWorks: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' },
          featuredWorks: {
            $sum: { $cond: ['$isFeatured', 1, 0] }
          },
          styles: { $addToSet: '$style' },
          avgDuration: { $avg: '$duration' }
        }
      }
    ]);

    return stats[0] || { 
      totalWorks: 0, 
      totalViews: 0, 
      totalLikes: 0, 
      featuredWorks: 0, 
      styles: [], 
      avgDuration: 0 
    };
  }
}
