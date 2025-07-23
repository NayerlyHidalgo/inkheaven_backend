import { Module, Global } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Global()
@Module({
  providers: [
    JwtAuthGuard,
    RolesGuard,
    LocalAuthGuard,
  ],
  exports: [
    JwtAuthGuard,
    RolesGuard,
    LocalAuthGuard,
  ],
})
export class CommonModule {}
