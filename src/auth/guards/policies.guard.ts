import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { PolicyHandler } from './policies.interface';
import { CHECK_POLICIES_KEY } from './policies.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];
      console.log("les handje", handlers);
    
    const request = context.switchToHttp().getRequest();
    // console.log("les user", request.user);
    
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("L'utilisateur n'est pas authentifié");
    }

    // Créer les permissions pour l'utilisateur
    console.log("les permision", user?.role?.permissions);

    console.log("les permision", user.role.permission);
    
    const ability = await this.caslAbilityFactory.createForUser(user?.role?.permissions);
    handlers.forEach((handler, index) => {
        
      const result = handler(ability);
      console.log(`Handler ${index} result:`, result);
    });
    console.log("every handler: ", handlers.every((handler) => handler(ability)));
    
    // Vérifier les permissions en utilisant les handlers
    return handlers.every((handler) => handler(ability));
  }
}
