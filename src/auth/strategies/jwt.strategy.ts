import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload: any) {
    console.log('🔑 JWT Strategy - Payload recibido:', payload);
    
    // Simplificar: usar solo los datos del payload sin consulta adicional
    const user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.name
    };
    
    console.log('🔑 JWT Strategy - Usuario validado:', user);
    return user;
  }
}
