import { ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { genSalt, hash } from 'bcrypt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from 'src/modules/user/entity/user.entity';
import { UserService } from 'src/modules/user/service/user.service';
import { UserModel } from '../model/user.model';
import { UserFactory } from '../entity/user-factory.helper';
import { CreateUserDto } from '../dto/create-user.dto';
import { PaginateModel, Types } from 'mongoose';
import { UserRole } from 'src/common/enum/user-role.enum';
import * as passwordHashModule from '../helpers/hash-password.helper';
describe('AuthenticationService', () => {
  let userModel: PaginateModel<User>;
  let userService: UserService;
  let userFactory: UserFactory;

  beforeEach(async () => {
    const userEntityProvider: Provider = {
      provide: getModelToken(UserModel.name),
      useValue: {},
    };
    const userFactoryProvider: Provider = {
      provide: UserFactory,
      useValue: {},
    };

    const providers: Provider[] = [
      UserService,
      userEntityProvider,
      userFactoryProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    userModel = testModule.get(getModelToken(UserModel.name));
    userService = testModule.get(UserService);
    userFactory = testModule.get(UserFactory);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('findByPhoneNumber', () => {
    it('should call findOne with correct data and call factory create with correct data', async () => {
      const phoneNumber = '09360094023';
      const id = new Types.ObjectId().toString();
      const password = await hash('1234', await genSalt(15));
      const userResult = {
        id,
        firstName: 'test',
        lastName: 'test',
        password,
        phoneNumber,
        username: 'test',
        toJSON: () => ({
          id,
          firstName: 'test',
          lastName: 'test',
          password,
          phoneNumber,
          username: 'test',
        }),
      };
      const user = new User({
        id,
        firstName: 'test',
        lastName: 'test',
        password,
        phoneNumber,
        username: 'test',
      });
      userModel.findOne = jest.fn().mockResolvedValue(userResult);
      userFactory.create = jest.fn().mockResolvedValue(user);
      const result = await userService.findByPhoneNumber(phoneNumber);
      expect(result).toStrictEqual(user);
      expect(userModel.findOne).toHaveBeenCalledTimes(1);
      expect(userModel.findOne).toHaveBeenNthCalledWith(1, {
        phoneNumber,
      });
      expect(userFactory.create).toHaveBeenCalledTimes(1);
      expect(userFactory.create).toHaveBeenNthCalledWith(
        1,
        userResult.toJSON(),
      );
    });
  });
  describe('findById', () => {
    it('should call findById with correct data and call factory create with correct data', async () => {
      const id = new Types.ObjectId().toString();
      const phoneNumber = '09360094023';
      const password = await hash('1234', await genSalt(15));
      const userResult = {
        id,
        firstName: 'test',
        lastName: 'test',
        password,
        phoneNumber,
        username: 'test',
        toJSON: () => ({
          id,
          firstName: 'test',
          lastName: 'test',
          password,
          phoneNumber,
          username: 'test',
        }),
      };
      const user = new User({
        id,
        firstName: 'test',
        lastName: 'test',
        password,
        phoneNumber,
        username: 'test',
      });
      userModel.findById = jest.fn().mockResolvedValue(userResult);
      userFactory.create = jest.fn().mockResolvedValue(user);
      const result = await userService.findById(id);
      expect(result).toStrictEqual(user);
      expect(userModel.findById).toHaveBeenCalledTimes(1);
      expect(userModel.findById).toHaveBeenNthCalledWith(1, id);
      expect(userFactory.create).toHaveBeenCalledTimes(1);
      expect(userFactory.create).toHaveBeenNthCalledWith(
        1,
        userResult.toJSON(),
      );
    });
  });
  describe('create', () => {
    it('should call create with correct data, and hash password, and call factory create with correct data', async () => {
      const phoneNumber = '09360094023';
      const id = new Types.ObjectId().toString();
      const hashedPassword = await hash('1234', await genSalt(15));
      jest
        .spyOn(passwordHashModule, 'hashData')
        .mockResolvedValue(hashedPassword);

      const userResult = {
        id,
        password: hashedPassword,
        firstName: 'test',
        lastName: 'test',
        phoneNumber,
        username: 'test',
        roles: [],
        toJSON: () => ({
          id,
          password: hashedPassword,
          firstName: 'test',
          lastName: 'test',
          phoneNumber,
          username: 'test',
          roles: [UserRole.ADMIN],
        }),
      };
      const user = new User({
        id,
        password: hashedPassword,
        firstName: 'test',
        lastName: 'test',
        phoneNumber,
        username: 'test',
        roles: [UserRole.ADMIN],
      });
      const createUserDto = new CreateUserDto({
        password: '1234',
        firstName: 'test',
        lastName: 'test',
        phoneNumber: '09360094842',
        username: 'test',
        roles: [UserRole.ADMIN],
      });
      userModel.create = jest.fn().mockResolvedValue(userResult);
      userFactory.create = jest.fn().mockResolvedValue(user);
      const result = await userService.create(createUserDto);
      expect(result).toStrictEqual(user);
      expect(userModel.create).toHaveBeenCalledTimes(1);
      expect(userFactory.create).toHaveBeenCalledTimes(1);
      expect(userFactory.create).toHaveBeenNthCalledWith(
        1,
        userResult.toJSON(),
      );
    });
  });
});
