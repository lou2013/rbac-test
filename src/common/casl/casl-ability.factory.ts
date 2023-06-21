import { AbilityBuilder, ExtractSubjectType, PureAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { USER_ROLE_ABILITIES } from '../constants/user-role-abilities.constant';
import { Action } from '../enum/casl-action.enum';
import { Resource } from '../enum/resource.enum';
import { UserRole } from '../enum/user-role.enum';
export type AppAbility = PureAbility<[Action, any]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(roles: UserRole[]): PureAbility<[Action, any], unknown> {
    const { can, build } = new AbilityBuilder<PureAbility<[Action, any]>>(
      PureAbility,
    );
    let abilities = [];
    for (const role of roles) {
      abilities = [...abilities, ...USER_ROLE_ABILITIES[role]];
    }

    for (const ability of abilities) {
      can(ability.action, ability.resource);
    }

    return build({
      detectSubjectType: (item: {
        constructor: ExtractSubjectType<Resource>;
      }) => item.constructor,
    });
  }
}
