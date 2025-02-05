import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from "src/user/decorator/roles.decorator";
import { Role } from "src/user/entities/role.entity";


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector){}

  canActivate(context: ExecutionContext): boolean {
      
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log("les role", requiredRoles);

    if (!requiredRoles){
      console.log("les role", requiredRoles);
      
      return true
    } 

    const {user} = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}