import { Action } from '../enum/casl-action.enum';
import { Resource } from '../enum/resource.enum';
import { UserRole } from '../enum/user-role.enum';

export const USER_ROLE_ABILITIES: Record<
  UserRole,
  { resource: Resource; action: Action }[]
> = {
  [UserRole.ADMIN]: [{ resource: Resource.ALL, action: Action.Manage }],
  [UserRole.SELL_ADMIN]: [
    { resource: Resource.USERS, action: Action.Manage },
    { resource: Resource.PRODUCTS, action: Action.Manage },
  ],
  [UserRole.ACCOUNTANT_ADMIN]: [
    { resource: Resource.PRODUCTS, action: Action.Manage },
    { resource: Resource.ORDERS, action: Action.Manage },
  ],
  [UserRole.CC_ADMIN]: [
    { resource: Resource.USERS, action: Action.Manage },
    { resource: Resource.COMMENTS, action: Action.Manage },
  ],
};
