import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/schemas/user.schema';
import { UserWithoutPassword } from '../users/user.types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validar credenciales de usuario
   */
  async validateUser(email: string, password: string): Promise<UserWithoutPassword | null> {
    const user: User | null = await this.usersService.findByEmail(email);

    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await this.usersService.validatePassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as UserWithoutPassword;
  }

  /**
   * Login del usuario
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    await this.usersService.updateLastLogin(user.id.toString());

    const payload = { 
      email: user.email, 
      sub: user.id.toString(), 
      role: user.role,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  /**
   * Registro de nuevo usuario
   */
  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);

    const payload = { 
      email: user.email, 
      sub: user.id.toString(), 
      role: user.role,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  /**
   * Obtener usuario por ID (sin contraseña)
   */
  async findUserById(id: string): Promise<UserWithoutPassword> {
    return await this.usersService.findByIdWithoutPassword(id);
  }

  /**
   * Perfil del usuario autenticado
   */
  async getProfile(userId: string) {
    const user = await this.usersService.findByIdWithoutPassword(userId);

    return {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      createdAt: user.createdAt,
      isActive: user.isActive,
    };
  }

  /**
   * Renovar token JWT
   */
  async refreshToken(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const payload = {
      email: user.email,
      sub: user.id.toString(),
      role: user.role,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
