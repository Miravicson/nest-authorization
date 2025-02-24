import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { AppAbility, CaslAbilityFactory } from './casl-ability.factory';
import { PolicyHandler } from './policy-handler';
import { SetMetadataKeyEnum } from '../auth/set-metadata-key.enum';
import { User } from '@prisma/client';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        SetMetadataKeyEnum.CHECK_POLICIES,
        context.getHandler(),
      ) || [];

    const currentUser: User = context.switchToHttp().getRequest().user as User;
    const ability =
      await this.caslAbilityFactory.createUserAbility(currentUser);

    return policyHandlers.every((handler) => {
      return this.execPolicyHandler(handler, ability);
    });
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }

    return handler.handle(ability);
  }
}
