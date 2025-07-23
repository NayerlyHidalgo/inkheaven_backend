import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true, type: Number })
  userId: number; // ID from PostgreSQL User

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  userEmail: string;

  @Prop({ required: true, type: Number })
  artistId: number; // ID from PostgreSQL Artist

  @Prop({ required: true })
  artistName: string;

  @Prop({ type: Number })
  productId?: number; // ID from PostgreSQL Product (optional)

  @Prop({ type: Number })
  appointmentId?: number; // ID from PostgreSQL Appointment (optional)

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true, maxlength: 1000 })
  comment: string;

  @Prop({ type: [String], default: [] })
  images: string[]; // URLs of review images

  @Prop({ 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  })
  status: string;

  @Prop({ type: [String], default: [] })
  tags: string[]; // e.g., ['professional', 'clean', 'creative']

  @Prop({ default: false })
  isVerified: boolean; // If the reviewer actually got a tattoo

  @Prop({ default: false })
  isFeatured: boolean; // To highlight exceptional reviews

  @Prop()
  moderatorNotes?: string;

  @Prop({ type: Date })
  serviceDate?: Date; // When the tattoo service was provided

  @Prop({ 
    type: String, 
    enum: ['design', 'artist', 'overall'], 
    default: 'overall' 
  })
  reviewType: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>; // Additional flexible data
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
