import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Artist } from '../../artists/artist.entity';
import { User } from '../../users/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  clientId: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'clientId' })
  client: User;

  @Column({ type: 'varchar', length: 255 })
  clientName: string;

  @Column({ type: 'varchar', length: 255 })
  clientEmail: string;

  @Column({ type: 'varchar', length: 20 })
  clientPhone: string;

  @Column({ type: 'int' })
  artistId: number;

  @ManyToOne(() => Artist, { eager: true })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @Column({ type: 'int', nullable: true })
  productId: number;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'timestamp' })
  appointmentDate: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'int', default: 1 })
  estimatedDuration: number; // in hours

  @Column({ type: 'varchar', length: 50, default: 'scheduled' })
  status: string; // scheduled, confirmed, in-progress, completed, cancelled, rescheduled

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  tattooDescription: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bodyPart: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  size: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  deposit: number;

  @Column({ type: 'boolean', default: false })
  isFirstSession: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  referenceImageUrl: string;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  paymentStatus: string; // pending, deposit-paid, fully-paid

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
