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
      console.log('🔒 RolesGuard - No se requieren roles específicos, acceso permitido');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    
    console.log('🔒 RolesGuard - Request completo:', {
      headers: request.headers?.authorization,
      user: request.user,
      userFromDestructuring: user
    });
    console.log('🔒 RolesGuard - Usuario:', user);
    console.log('🔒 RolesGuard - Roles requeridos:', requiredRoles);
    console.log('🔒 RolesGuard - Rol del usuario:', user?.role);
    console.log('🔒 RolesGuard - Tipo del rol:', typeof user?.role);
    
    if (!user) {
      console.log('🔒 RolesGuard - ❌ No hay usuario en el request');
      return false;
    }
    
    if (!user.role) {
      console.log('🔒 RolesGuard - ❌ Usuario no tiene rol definido');
      return false;
    }
    
    // Corregir la validación: user.role es un string, no un array
    const hasPermission = requiredRoles.some((role) => user.role === role);
    console.log('🔒 RolesGuard - ¿Tiene permisos?', hasPermission);
    
    return hasPermission;
  }
}
