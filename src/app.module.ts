import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { ProductsModule } from './products/products.module';
import { ArtistsModule } from './artists/artists.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { HealthModule } from './health/health.module';
import { CategoriesModule } from './categories/categories.module';
// Import only entities that should be in PostgreSQL
import { Product } from './products/entities/product.entity';
import { Artist } from './artists/artist.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // PostgreSQL - Solo para products, artists, appointments
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      entities: [Product, Artist], // Solo entidades que van en PostgreSQL
      synchronize: true, // Recrear las tablas
      logging: true,
      extra: {
        connectionLimit: 10,
        acquireConnectionTimeout: 60000,
        timeout: 60000,
        idleTimeoutMillis: 30000,
        query_timeout: 60000,
      },
    }),
    // MongoDB - Para users y categories 
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/ink-heaven'),
    CommonModule,
    AuthModule,
    ProductsModule,
    ArtistsModule,
    AppointmentsModule,
    UsersModule,  // Ahora usa MongoDB
    ReviewsModule,
    PortfolioModule,
    HealthModule,
    CategoriesModule,  // Ahora usa MongoDB
    // Temporarily disabled problematic modules:
    // CartModule,
    // InvoicesModule, 
    // OrdenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
