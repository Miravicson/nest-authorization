import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import {
  AppAbility,
  CaslAbilityFactory,
} from '../../casl/casl-ability.factory';
import { PolicyHandler } from '../../casl/policy-handler';
import { SetMetadataKeyEnum } from '../set-metadata-key.enum';
import { AuthenticatedRequest } from 'src/auth/types';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        SetMetadataKeyEnum.CHECK_POLICIES,
        context.getHandler(),
      ) || [];

    const user = context.switchToHttp().getRequest<AuthenticatedRequest>().user;

    const ability = await this.caslAbilityFactory.createUserAbility(user);

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
