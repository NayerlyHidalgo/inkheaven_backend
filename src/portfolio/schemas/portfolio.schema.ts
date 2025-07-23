import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PortfolioDocument = Portfolio & Document;

@Schema({ timestamps: true })
export class Portfolio {
  @Prop({ required: true, type: Number })
  artistId: number; // ID from PostgreSQL Artist

  @Prop({ required: true })
  artistName: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, maxlength: 2000 })
  description: string;

  @Prop({ type: [String], required: true })
  images: string[]; // Array of image URLs

  @Prop({ type: Number })
  clientId?: number; // ID from PostgreSQL User (if client agreed to showcase)

  @Prop()
  clientName?: string; // Or anonymous

  @Prop({ type: Number })
  appointmentId?: number; // Reference to the appointment

  @Prop({ required: true })
  style: string; // e.g., 'realistic', 'traditional', 'minimalist'

  @Prop({ type: [String], default: [] })
  tags: string[]; // e.g., ['arm', 'black-and-grey', 'portrait']

  @Prop()
  bodyPart: string; // e.g., 'arm', 'back', 'leg'

  @Prop()
  size: string; // e.g., 'small', 'medium', 'large'

  @Prop({ type: [String], default: [] })
  colors: string[]; // e.g., ['black', 'red', 'blue']

  @Prop()
  duration: number; // Hours taken to complete

  @Prop({ type: Date })
  completionDate: Date; // When the tattoo was completed

  @Prop({ default: false })
  isFeatured: boolean; // Highlighted work

  @Prop({ 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft' 
  })
  status: string;

  @Prop({ default: 0 })
  likes: number; // Public engagement

  @Prop({ default: 0 })
  views: number; // How many times viewed

  @Prop({ type: [String], default: [] })
  techniques: string[]; // e.g., ['shading', 'linework', 'dotwork']

  @Prop()
  difficulty: string; // e.g., 'beginner', 'intermediate', 'advanced'

  @Prop({ type: Object })
  beforeAndAfter?: {
    beforeImage?: string;
    afterImage: string;
    healingStages?: string[]; // URLs of healing process images
  };

  @Prop({ type: Object })
  metadata?: Record<string, any>; // Additional flexible data

  @Prop({ type: [String], default: [] })
  awards?: string[]; // If the work won any awards or recognition

  @Prop()
  inspirationSource?: string; // What inspired this piece

  @Prop({ default: true })
  isPublic: boolean; // Whether it's visible to public or just client
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
