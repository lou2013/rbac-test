import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/modules/user/entity/user.entity';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

export class MakeAbilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(CaslAbilityFactory)
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user: User = context.switchToHttp().getRequest().user;

    try {
      const ability = this.caslAbilityFactory.createForUser(user.roles);
      context.switchToHttp().getRequest().ability = ability;
      return Boolean(ability);
    } catch (error) {
      throw error;
    }
  }
}

// export const MakeAbilityGuard = (resource: Resource) => {
//   const guard = mixin(makeAbilityGuardMixing);
//   return guard;
// };
