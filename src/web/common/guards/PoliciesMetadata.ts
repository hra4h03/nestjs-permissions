import { AnyMongoAbility } from '@casl/ability';
import { SetMetadata } from '@nestjs/common';

import { Permission } from '@aggregates/user/permission/permission';

interface IPolicyHandler {
  handle(ability: AnyMongoAbility): boolean;
}

type PolicyHandlerCallback = (ability: AnyMongoAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);

export type ActionPermission = [Permission];

export const CHECK_REQUIRED_POLICIES_KEY = 'check_required_policy';
export const RequiredPermissions = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_REQUIRED_POLICIES_KEY, handlers);
