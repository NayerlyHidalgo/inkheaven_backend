// Export common utilities
export * from './common';

// Export all entities
export { Product } from './products/entities/product.entity';
export { Artist } from './artists/artist.entity';
export { Appointment } from './appointments/entities/appointment.entity';
export { User } from './users/user.entity';

// Export MongoDB schemas
export { Review } from './reviews/schemas/review.schema';
export { Portfolio } from './portfolio/schemas/portfolio.schema';

// Export all modules
export { CommonModule } from './common/common.module';
export { ProductsModule } from './products/products.module';
export { ArtistsModule } from './artists/artists.module';
export { AppointmentsModule } from './appointments/appointments.module';
export { UsersModule } from './users/users.module';
export { AuthModule } from './auth/auth.module';
export { ReviewsModule } from './reviews/reviews.module';
export { PortfolioModule } from './portfolio/portfolio.module';

// Export services
export { ProductsService } from './products/services/products.service';
export { SchedulingService } from './appointments/scheduling/scheduling.service';
export { AuthService } from './auth/auth.service';
export { UsersService } from './users/users.service';
export { ReviewsService } from './reviews/reviews.service';
export { PortfolioService } from './portfolio/portfolio.service';

// Export DTOs
export { CreateProductDto } from './products/dto/create-product.dto';
export { UpdateProductDto } from './products/dto/update-product.dto';
export { LoginDto } from './auth/dto/login.dto';
export { RegisterDto } from './auth/dto/register.dto';
export { CreateReviewDto } from './reviews/dto/create-review.dto';
export { UpdateReviewDto } from './reviews/dto/update-review.dto';
export { CreatePortfolioDto } from './portfolio/dto/create-portfolio.dto';
export { UpdatePortfolioDto } from './portfolio/dto/update-portfolio.dto';
