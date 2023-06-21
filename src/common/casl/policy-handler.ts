import { SetMetadata } from '@nestjs/common';
import { AppAbility } from './casl-ability.factory';
import { CHECK_POLICIES_KEY } from './casl.constants';

interface IPolicyHandler {
  handle(ability: AppAbility, subject?: unknown): boolean;
}

type PolicyHandlerCallback = (
  ability: AppAbility,
  subject?: unknown,
) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
