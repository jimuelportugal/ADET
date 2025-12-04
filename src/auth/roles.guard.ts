import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector) {}

    canActivate(
        context,
    ) {
        const requiredRoles = this.reflector.get(
            'roles',
            context.getHandler(),
        );

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user; 

        if (!user || !user.role || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException('You do not have the required permissions to access this resource.');
        }
        
        return true;
    }
}
