import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AppAbility, ClaimFactory } from '../claim/claim.factory';
import { CHECK_POLICIES_KEY, PolicyHandler } from './PoliciesMetadata';
import { EntityManager } from '@mikro-orm/postgresql';
import { RequestWithUser } from '@/auth/guards/JwtGuard';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: ClaimFactory,
    private readonly em: EntityManager,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const user = context.switchToHttp().getRequest<RequestWithUser>().user;

    const ability = await this.caslAbilityFactory.createForUser(user);

    return policyHandlers.every((handler) =>
      this.executePolicyHandler(handler, ability),
    );
  }

  private executePolicyHandler(
    handler: PolicyHandler,
    ability: AppAbility,
  ): boolean {
    if (typeof handler === 'function') {
      return handler(ability);
    }

    return handler.handle(ability);
  }
}

export const UsePoliciesGuard = () => UseGuards(PoliciesGuard);
