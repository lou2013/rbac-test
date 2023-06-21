import { ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Action } from '../enum/casl-action.enum';
import { Resource } from '../enum/resource.enum';
import { UserRole } from '../enum/user-role.enum';
import { CaslAbilityFactory } from './casl-ability.factory';
describe('CaslAbilityFactory', () => {
  let caslAbilityFactory: CaslAbilityFactory;

  beforeEach(async () => {
    const providers: Provider[] = [CaslAbilityFactory];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    caslAbilityFactory = testModule.get(CaslAbilityFactory);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('createForUser', () => {
    it(`${UserRole.ADMIN} must have access to all resources`, async () => {
      const ability = caslAbilityFactory.createForUser([UserRole.ADMIN]);
      expect(ability.can(Action.Manage, Resource.ALL)).toBe(true);
    });
    it(`${UserRole.ACCOUNTANT_ADMIN} must have access to products and orders`, async () => {
      const ability = caslAbilityFactory.createForUser([
        UserRole.ACCOUNTANT_ADMIN,
      ]);
      expect(ability.can(Action.Manage, Resource.ORDERS)).toBe(true);
      expect(ability.can(Action.Manage, Resource.PRODUCTS)).toBe(true);
      expect(ability.can(Action.Manage, Resource.USERS)).toBe(false);
      expect(ability.can(Action.Manage, Resource.COMMENTS)).toBe(false);
      expect(ability.can(Action.Manage, Resource.ALL)).toBe(false);
    });

    it(`${UserRole.CC_ADMIN} must have access to users and comments`, async () => {
      const ability = caslAbilityFactory.createForUser([UserRole.CC_ADMIN]);
      expect(ability.can(Action.Manage, Resource.USERS)).toBe(true);
      expect(ability.can(Action.Manage, Resource.COMMENTS)).toBe(true);
      expect(ability.can(Action.Manage, Resource.ORDERS)).toBe(false);
      expect(ability.can(Action.Manage, Resource.PRODUCTS)).toBe(false);
      expect(ability.can(Action.Manage, Resource.ALL)).toBe(false);
    });

    it(`${UserRole.SELL_ADMIN} must have access to users and comments`, async () => {
      const ability = caslAbilityFactory.createForUser([UserRole.SELL_ADMIN]);
      expect(ability.can(Action.Manage, Resource.USERS)).toBe(true);
      expect(ability.can(Action.Manage, Resource.ORDERS)).toBe(true);
      expect(ability.can(Action.Manage, Resource.COMMENTS)).toBe(false);
      expect(ability.can(Action.Manage, Resource.PRODUCTS)).toBe(false);
      expect(ability.can(Action.Manage, Resource.ALL)).toBe(false);
    });
    it(`user with roles [${
      (UserRole.CC_ADMIN, UserRole.ACCOUNTANT_ADMIN)
    }] must have access to users and comments and products and orders`, async () => {
      const ability = caslAbilityFactory.createForUser([
        UserRole.CC_ADMIN,
        UserRole.ACCOUNTANT_ADMIN,
      ]);
      expect(ability.can(Action.Manage, Resource.USERS)).toBe(true);
      expect(ability.can(Action.Manage, Resource.ORDERS)).toBe(true);
      expect(ability.can(Action.Manage, Resource.COMMENTS)).toBe(true);
      expect(ability.can(Action.Manage, Resource.PRODUCTS)).toBe(true);
      expect(ability.can(Action.Manage, Resource.ALL)).toBe(false);
    });
  });
});
