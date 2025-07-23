import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'text', nullable: true })
  specialties: string; // JSON string array of specialties

  @Column({ type: 'int', default: 0 })
  experienceYears: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  profileImageUrl: string;

  @Column({ type: 'text', nullable: true })
  portfolioImages: string; // JSON string array of image URLs

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  hourlyRate: number;

  @Column({ type: 'text', nullable: true })
  workingHours: string; // JSON string object with schedule

  @Column({ type: 'text', nullable: true })
  unavailableDates: string; // JSON string array of dates

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  totalReviews: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  instagram: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  facebook: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
