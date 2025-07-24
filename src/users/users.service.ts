import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from '../auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UserWithoutPassword } from './user.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Buscar usuario por email (con contraseña incluida)
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  /**
   * Crear nuevo usuario
   */
  async create(registerDto: RegisterDto): Promise<User> {
    const { email, password, ...userData } = registerDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('El correo ya está en uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = new this.userModel({
      ...userData,
      email,
      password: hashedPassword,
    });

    return await createdUser.save();
  }

  /**
   * Buscar usuario por ID (con contraseña)
   */
  async findById(id: string): Promise<User | null> {
    return await this.userModel.findById(id).exec();
  }

  /**
   * Buscar usuario por ID (sin contraseña)
   */
  async findByIdWithoutPassword(id: string): Promise<UserWithoutPassword> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user.toObject() as UserWithoutPassword;
  }

  /**
   * Obtener todos los usuarios (sin contraseñas)
   */
  async findAll(): Promise<UserWithoutPassword[]> {
    const users = await this.userModel.find().select('-password').exec();
    return users.map(user => user.toObject() as UserWithoutPassword);
  }

  /**
   * Actualizar fecha de último inicio de sesión
   */
  async updateLastLogin(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { updatedAt: new Date() });
  }

  /**
   * Validar contraseña
   */
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Actualizar datos del usuario
   */
  async updateUser(id: string, updateData: Partial<User>): Promise<UserWithoutPassword | null> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password')
      .exec();

    return updatedUser ? (updatedUser.toObject() as UserWithoutPassword) : null;
  }

  /**
   * Desactivar usuario
   */
  async deactivateUser(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { isActive: false });
  }
}
