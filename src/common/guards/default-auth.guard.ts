import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { MakeAbilityGuard } from './make-ability.guard';
import { PoliciesGuard } from './policy.guard';

export function DefaultAuth(): <F, Y>(
  target: object | F,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void {
  return applyDecorators(
    UseGuards(JwtAuthGuard, MakeAbilityGuard, PoliciesGuard),
  );
}
