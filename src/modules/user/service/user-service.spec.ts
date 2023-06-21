import { ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { genSalt, hash } from 'bcrypt';
import { User } from 'src/modules/user/entity/user.entity';
import { UserService } from 'src/modules/user/service/user.service';
import { UserModel } from '../model/user.model';
import { AppRepository } from 'src/common/constants/app.repository';
import { UserFactory } from '../entity/user-factory.helper';
import { Op } from 'sequelize';
import { CreateUserDto } from '../dto/create-user.dto';
import { hashData } from '../helpers/hash-password.helper';
describe('AuthenticationService', () => {
  let userRepository: typeof UserModel;
  let userService: UserService;
  let userFactory: UserFactory;

  beforeEach(async () => {
    const userRepositoryProvider: Provider = {
      provide: AppRepository.User,
      useValue: {},
    };
    const userFactoryProvider: Provider = {
      provide: UserFactory,
      useValue: {},
    };

    const providers: Provider[] = [
      UserService,
      userRepositoryProvider,
      userFactoryProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    userRepository = testModule.get(AppRepository.User);
    userService = testModule.get(UserService);
    userFactory = testModule.get(UserFactory);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should call findOne with correct data and call factory create with correct data', async () => {
      const email = 'a@a.com';
      const password = await hash('1234', await genSalt(15));
      const userModel = {
        id: 1,
        password,
        email: 'a@a.com',
        username: 'test',
        toJSON: () => ({
          id: 1,
          password,
          email: 'a@a.com',
          username: 'test',
        }),
      };
      const user = new User({
        id: 1,
        password,
        email: 'a@a.com',
        username: 'test',
      });
      userRepository.findOne = jest.fn().mockResolvedValue(userModel);
      userFactory.create = jest.fn().mockResolvedValue(user);
      const result = await userService.findByPhoneNumber('a@a.com');
      expect(result).toStrictEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenNthCalledWith(1, {
        where: { email: { [Op.eq]: email } },
      });
      expect(userFactory.create).toHaveBeenCalledTimes(1);
      expect(userFactory.create).toHaveBeenNthCalledWith(1, userModel.toJSON());
    });
  });
  describe('findById', () => {
    it('should call findByPk with correct data and call factory create with correct data', async () => {
      const id = 1;
      const password = await hash('1234', await genSalt(15));
      const userModel = {
        id,
        password,
        email: 'a@a.com',
        username: 'test',
        toJSON: () => ({
          id,
          password,
          email: 'a@a.com',
          username: 'test',
        }),
      };
      const user = new User({
        id,
        password,
        email: 'a@a.com',
        username: 'test',
      });
      userRepository.findByPk = jest.fn().mockResolvedValue(userModel);
      userFactory.create = jest.fn().mockResolvedValue(user);
      const result = await userService.findById(id);
      expect(result).toStrictEqual(user);
      expect(userRepository.findByPk).toHaveBeenCalledTimes(1);
      expect(userRepository.findByPk).toHaveBeenNthCalledWith(1, id);
      expect(userFactory.create).toHaveBeenCalledTimes(1);
      expect(userFactory.create).toHaveBeenNthCalledWith(1, userModel.toJSON());
    });
  });
  describe('create', () => {
    it('should call create with correct data, and hash password, and call factory create with correct data', async () => {
      const id = 1;
      const hashedPassword = await hash('1234', await genSalt(15));
      jest.mock('../helpers/hash-password.helper', () => ({
        ...jest.requireActual('./myModule.js'),
        hashData: (data: string) => hashedPassword,
      }));
      const userModel = {
        id,
        password: hashedPassword,
        email: 'a@a.com',
        username: 'test',
        toJSON: () => ({
          id,
          password: hashedPassword,
          email: 'a@a.com',
          username: 'test',
        }),
      };
      const user = new User({
        id,
        password: hashedPassword,
        email: 'a@a.com',
        username: 'test',
      });
      const createUserDto = new CreateUserDto({
        password: '1234',
        email: 'a@a.com',
        username: 'test',
      });
      userRepository.create = jest.fn().mockResolvedValue(userModel);
      userFactory.create = jest.fn().mockResolvedValue(user);
      const result = await userService.create(createUserDto);
      expect(result).toStrictEqual(user);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userFactory.create).toHaveBeenCalledTimes(1);
      expect(userFactory.create).toHaveBeenNthCalledWith(1, userModel.toJSON());
    });
  });
  describe('createMAny', () => {
    it('should call bulkCreate with correct data, and hash password, and call factory create with correct data', async () => {
      const id = 1;
      const hashedPassword = await hash('1234', await genSalt(15));
      jest.mock('../helpers/hash-password.helper', () => ({
        ...jest.requireActual('./myModule.js'),
        hashData: (data: string) => hashedPassword,
      }));
      const userModels = [
        {
          id,
          password: hashedPassword,
          email: 'a@a.com',
          username: 'test',
          toJSON: () => ({
            id,
            password: hashedPassword,
            email: 'a@a.com',
            username: 'test',
          }),
        },
        {
          id,
          password: hashedPassword,
          email: 'a@a.com',
          username: 'test',
          toJSON: () => ({
            id,
            password: hashedPassword,
            email: 'a@a.com',
            username: 'test',
          }),
        },
        {
          id,
          password: hashedPassword,
          email: 'a@a.com',
          username: 'test',
          toJSON: () => ({
            id,
            password: hashedPassword,
            email: 'a@a.com',
            username: 'test',
          }),
        },
        {
          id,
          password: hashedPassword,
          email: 'a@a.com',
          username: 'test',
          toJSON: () => ({
            id,
            password: hashedPassword,
            email: 'a@a.com',
            username: 'test',
          }),
        },
      ];
      const users = [
        new User({
          id,
          password: hashedPassword,
          email: 'a@a.com',
          username: 'test',
        }),
        new User({
          id,
          password: hashedPassword,
          email: 'a@a.com',
          username: 'test',
        }),
        new User({
          id,
          password: hashedPassword,
          email: 'a@a.com',
          username: 'test',
        }),
        new User({
          id,
          password: hashedPassword,
          email: 'a@a.com',
          username: 'test',
        }),
      ];
      const createUserDtos = [
        new CreateUserDto({
          password: '1234',
          email: 'a@a.com',
          username: 'test',
        }),
        new CreateUserDto({
          password: '1234',
          email: 'a@a.com',
          username: 'test',
        }),
        new CreateUserDto({
          password: '1234',
          email: 'a@a.com',
          username: 'test',
        }),
        new CreateUserDto({
          password: '1234',
          email: 'a@a.com',
          username: 'test',
        }),
      ];
      userRepository.bulkCreate = jest.fn().mockResolvedValue(userModels);
      userFactory.createMany = jest.fn().mockResolvedValue(users);
      const result = await userService.createMany(createUserDtos);
      expect(result).toStrictEqual(users);
      expect(userRepository.bulkCreate).toHaveBeenCalledTimes(1);
      expect(userFactory.createMany).toHaveBeenCalledTimes(1);
      expect(userFactory.createMany).toHaveBeenNthCalledWith(
        1,
        userModels.map((u) => u.toJSON()),
      );
    });
  });

  // describe('signUp', () => {
  //   it('must throw error if user with email already exists', async () => {
  //     const signUpDto = new SignupDto({
  //       email: 'a@a.com',
  //       id: 2,
  //       password: '1234',
  //       username: 'test',
  //     });
  //     const user = new User({
  //       id: 1,
  //       password: await hash('1234', await genSalt(15)),
  //       email: 'a@a.com',
  //       username: 'test',
  //     });
  //     userService.findByEmail = jest.fn().mockReturnValue(user);
  //     expect(async () => await authService.signUp(signUpDto)).rejects.toThrow(
  //       ConflictException,
  //     );
  //     expect(userService.findByEmail).toHaveBeenCalledTimes(1);
  //   });

  //   it("must create user if user with email doesn't exist", async () => {
  //     const signUpDto = new SignupDto({
  //       email: 'a@a.com',
  //       id: 2,
  //       password: '1234',
  //       username: 'test',
  //     });
  //     const user = new User({
  //       id: 1,
  //       password: await hash('1234', await genSalt(15)),
  //       email: 'a@a.com',
  //       username: 'test',
  //     });
  //     userService.findByEmail = jest.fn().mockReturnValue(undefined);
  //     userService.create = jest.fn().mockReturnValue(user);
  //     authService.login = jest.fn().mockReturnValue({});
  //     await authService.signUp(signUpDto);
  //     expect(userService.findByEmail).toHaveBeenCalledTimes(1);
  //     expect(userService.create).toHaveBeenCalledTimes(1);
  //     expect(authService.login).toHaveBeenCalledTimes(1);
  //   });
  // });

  // describe('login', () => {
  //   it("must return undefined if user doesn't exist", async () => {
  //     configService.get = jest.fn();
  //     jwtService.sign = jest.fn();
  //     redisClient.set = jest.fn();
  //     const result = await authService.login(undefined);
  //     expect(result).toBe(undefined);
  //     expect(configService.get).toHaveBeenCalledTimes(0);
  //     expect(jwtService.sign).toHaveBeenCalledTimes(0);
  //     expect(redisClient.set).toHaveBeenCalledTimes(0);
  //   });

  //   it('must create access token and refresh token for user if user is passed', async () => {
  //     configService.get = jest.fn().mockReturnValue({
  //       name: 'test',
  //       description: 'test backend',
  //       debug: true,
  //       version: 1.0,
  //       secret: 'jwtsecret-kasdnisucrweis',
  //       tokenExpireTime: '2d',
  //       refreshSecret: 'fWSf!deVz@j+dH2Cvu6DNhAxs!gdq7+2',
  //       refreshTokenExpireTime: '14d',
  //       otlExpireTime: '2M',
  //       environment: 'development',
  //     });
  //     jwtService.sign = jest.fn().mockReturnValue('test');
  //     redisClient.set = jest.fn();
  //     const user = new User({
  //       id: 1,
  //       password: await hash('1234', await genSalt(15)),
  //       email: 'a@a.com',
  //       username: 'test',
  //     });
  //     const result = await authService.login(user);
  //     expect(result).toStrictEqual(
  //       new LoginResponseDto({
  //         accessToken: 'test',
  //         refreshToken: 'test',
  //         user: new UserDto(user),
  //       }),
  //     );
  //     expect(configService.get).toHaveBeenCalledTimes(2);
  //     expect(jwtService.sign).toHaveBeenCalledTimes(2);
  //     expect(redisClient.set).toHaveBeenCalledTimes(1);
  //   });
  // });
  // describe('refresh', () => {
  //   it('must throw error if token does not exist', async () => {
  //     const user = new User({
  //       id: 1,
  //       password: await hash('1234', await genSalt(15)),
  //       email: 'a@a.com',
  //       username: 'test',
  //     });
  //     redisClient.get = jest.fn().mockReturnValue(undefined);
  //     redisClient.del = jest.fn();
  //     authService.login = jest.fn();
  //     expect(
  //       async () => await authService.refresh({ refreshToken: '1234', user }),
  //     ).rejects.toThrow(BadRequestException);
  //     expect(redisClient.get).toHaveBeenCalledTimes(1);
  //     expect(redisClient.del).toHaveBeenCalledTimes(0);
  //     expect(authService.login).toHaveBeenCalledTimes(0);
  //   });

  //   it('must login user if token is correct', async () => {
  //     const user = new User({
  //       id: 1,
  //       password: await hash('1234', await genSalt(15)),
  //       email: 'a@a.com',
  //       username: 'test',
  //     });
  //     redisClient.get = jest.fn().mockReturnValue('1');
  //     redisClient.del = jest.fn();
  //     authService.login = jest.fn();
  //     await authService.refresh({ refreshToken: '1234', user });

  //     expect(redisClient.get).toHaveBeenCalledTimes(1);
  //     expect(redisClient.del).toHaveBeenCalledTimes(1);
  //     expect(authService.login).toHaveBeenCalledTimes(1);
  //   });
  // });
});
