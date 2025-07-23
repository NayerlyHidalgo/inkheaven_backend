import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const createdReview = new this.reviewModel(createReviewDto);
    return createdReview.save();
  }

  async findAll(filters?: any): Promise<Review[]> {
    const query = this.reviewModel.find();
    
    if (filters) {
      if (filters.artistId) query.where('artistId').equals(filters.artistId);
      if (filters.userId) query.where('userId').equals(filters.userId);
      if (filters.status) query.where('status').equals(filters.status);
      if (filters.rating) query.where('rating').equals(filters.rating);
      if (filters.reviewType) query.where('reviewType').equals(filters.reviewType);
      if (filters.isVerified !== undefined) query.where('isVerified').equals(filters.isVerified);
      if (filters.isFeatured !== undefined) query.where('isFeatured').equals(filters.isFeatured);
    }

    return query.sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  async findByArtist(artistId: number): Promise<Review[]> {
    return this.reviewModel
      .find({ artistId, status: 'approved' })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByUser(userId: number): Promise<Review[]> {
    return this.reviewModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getFeaturedReviews(): Promise<Review[]> {
    return this.reviewModel
      .find({ isFeatured: true, status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();
  }

  async getArtistStats(artistId: number): Promise<any> {
    const stats = await this.reviewModel.aggregate([
      { $match: { artistId, status: 'approved' } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratings: {
            $push: '$rating'
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalReviews: 1,
          averageRating: { $round: ['$averageRating', 2] },
          ratingDistribution: {
            5: {
              $size: {
                $filter: {
                  input: '$ratings',
                  cond: { $eq: ['$$this', 5] }
                }
              }
            },
            4: {
              $size: {
                $filter: {
                  input: '$ratings',
                  cond: { $eq: ['$$this', 4] }
                }
              }
            },
            3: {
              $size: {
                $filter: {
                  input: '$ratings',
                  cond: { $eq: ['$$this', 3] }
                }
              }
            },
            2: {
              $size: {
                $filter: {
                  input: '$ratings',
                  cond: { $eq: ['$$this', 2] }
                }
              }
            },
            1: {
              $size: {
                $filter: {
                  input: '$ratings',
                  cond: { $eq: ['$$this', 1] }
                }
              }
            }
          }
        }
      }
    ]);

    return stats[0] || { totalReviews: 0, averageRating: 0, ratingDistribution: {} };
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .exec();
    
    if (!updatedReview) {
      throw new NotFoundException('Review not found');
    }
    
    return updatedReview;
  }

  async remove(id: string): Promise<void> {
    const result = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Review not found');
    }
  }

  async moderateReview(id: string, status: string, moderatorNotes?: string): Promise<Review> {
    return this.update(id, { status, moderatorNotes });
  }

  async toggleFeatured(id: string): Promise<Review> {
    const review = await this.findOne(id);
    return this.update(id, { isFeatured: !review.isFeatured });
  }
}
