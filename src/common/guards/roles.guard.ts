import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('🔒 RolesGuard - Usuario:', user);
    console.log('🔒 RolesGuard - Roles requeridos:', requiredRoles);
    console.log('🔒 RolesGuard - Rol del usuario:', user.role);
    
    // Corregir la validación: user.role es un string, no un array
    return requiredRoles.some((role) => user.role === role);
  }
}
