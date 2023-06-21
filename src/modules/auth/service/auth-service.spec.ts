import { RedisManager } from '@liaoliaots/nestjs-redis';
import { BadRequestException, ModuleMetadata, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { genSalt, hash } from 'bcrypt';
import { User } from 'src/modules/user/entity/user.entity';
import { UserService } from 'src/modules/user/service/user.service';
import { AuthenticationService } from './auth.service';
import { Redis } from 'ioredis';
import { LoginResponseDto } from '../dto/login-response.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { Types } from 'mongoose';
describe('AuthenticationService', () => {
  let authService: AuthenticationService;
  let userService: UserService;
  let redisManagerService: RedisManager;
  let configService: ConfigService;
  let jwtService: JwtService;
  let redisClient: Redis;

  beforeEach(async () => {
    const userServiceProvider: Provider = {
      provide: UserService,
      useValue: {},
    };
    const redisManagerProvider: Provider = {
      provide: RedisManager,
      useValue: {
        getClient: (name: string) => {
          return {};
        },
      },
    };
    const configServiceProvider: Provider = {
      provide: ConfigService,
      useValue: {},
    };
    const JwtServiceProvider: Provider = {
      provide: JwtService,
      useValue: {},
    };

    const providers: Provider[] = [
      AuthenticationService,
      userServiceProvider,
      redisManagerProvider,
      configServiceProvider,
      JwtServiceProvider,
    ];
    const moduleMetadata: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetadata).compile();

    authService = testModule.get(AuthenticationService);
    redisClient = authService.redisClient;
    userService = testModule.get(UserService);
    redisManagerService = testModule.get(RedisManager);
    configService = testModule.get(ConfigService);
    jwtService = testModule.get(JwtService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('validateUserWithPassword', () => {
    it('should return the user if the given password and user password are the same', async () => {
      const user = new User({
        id: new Types.ObjectId().toString(),
        password: await hash('1234', await genSalt(15)),
        username: 'test',
        firstName: 'test',
        lastName: 'test',
        phoneNumber: '09360000000',
      });
      userService.findByPhoneNumber = jest.fn().mockReturnValue(user);

      const result = await authService.validateUserWithPassword({
        phoneNumber: '09360000000',
        password: '1234',
      });
      expect(result).toStrictEqual(user);
      expect(userService.findByPhoneNumber).toHaveBeenCalledTimes(1);
    });
    it('should return undefined if the given password and user password are not the same', async () => {
      const user = new User({
        id: new Types.ObjectId().toString(),
        password: await hash('1234', await genSalt(15)),
        username: 'test',
        firstName: 'test',
        lastName: 'test',
        phoneNumber: '09360000000',
      });
      userService.findByPhoneNumber = jest.fn().mockReturnValue(user);

      const result = await authService.validateUserWithPassword({
        phoneNumber: '09360000000',
        password: '12345',
      });
      expect(result).toBe(undefined);
      expect(userService.findByPhoneNumber).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it("must return undefined if user doesn't exist", async () => {
      configService.get = jest.fn();
      jwtService.sign = jest.fn();
      redisClient.set = jest.fn();
      const result = await authService.login(undefined);
      expect(result).toBe(undefined);
      expect(configService.get).toHaveBeenCalledTimes(0);
      expect(jwtService.sign).toHaveBeenCalledTimes(0);
      expect(redisClient.set).toHaveBeenCalledTimes(0);
    });

    it('must create access token and refresh token for user if user is passed', async () => {
      configService.get = jest.fn().mockReturnValue({
        name: 'test',
        description: 'test backend',
        debug: true,
        version: 1.0,
        secret: 'jwtsecret-kasdnisucrweis',
        tokenExpireTime: '2d',
        refreshSecret: 'fWSf!deVz@j+dH2Cvu6DNhAxs!gdq7+2',
        refreshTokenExpireTime: '14d',
        otlExpireTime: '2M',
        environment: 'development',
      });
      jwtService.sign = jest.fn().mockReturnValue('test');
      redisClient.set = jest.fn();
      const user = new User({
        id: new Types.ObjectId().toString(),
        password: await hash('1234', await genSalt(15)),
        username: 'test',
        firstName: 'test',
        lastName: 'test',
        phoneNumber: '09360000000',
      });
      const result = await authService.login(user);
      expect(result).toStrictEqual(
        new LoginResponseDto({
          accessToken: 'test',
          refreshToken: 'test',
          user: new UserDto(user),
        }),
      );
      expect(configService.get).toHaveBeenCalledTimes(2);
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(redisClient.set).toHaveBeenCalledTimes(1);
    });
  });
  describe('refresh', () => {
    it('must throw error if token does not exist', async () => {
      const user = new User({
        id: new Types.ObjectId().toString(),
        password: await hash('1234', await genSalt(15)),
        username: 'test',
        firstName: 'test',
        lastName: 'test',
        phoneNumber: '09360000000',
      });
      redisClient.get = jest.fn().mockReturnValue(undefined);
      redisClient.del = jest.fn();
      authService.login = jest.fn();
      expect(
        async () => await authService.refresh({ refreshToken: '1234', user }),
      ).rejects.toThrow(BadRequestException);
      expect(redisClient.get).toHaveBeenCalledTimes(1);
      expect(redisClient.del).toHaveBeenCalledTimes(0);
      expect(authService.login).toHaveBeenCalledTimes(0);
    });

    it('must login user if token is correct', async () => {
      const user = new User({
        id: new Types.ObjectId().toString(),
        password: await hash('1234', await genSalt(15)),
        username: 'test',
        firstName: 'test',
        lastName: 'test',
        phoneNumber: '09360000000',
      });
      redisClient.get = jest.fn().mockReturnValue('1');
      redisClient.del = jest.fn();
      authService.login = jest.fn();
      await authService.refresh({ refreshToken: '1234', user });

      expect(redisClient.get).toHaveBeenCalledTimes(1);
      expect(redisClient.del).toHaveBeenCalledTimes(1);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });
  });
});
