import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/entity/user.entity';
import { UserService } from 'src/modules/user/service/user.service';
import { compare } from 'bcrypt';
import { LoginResponseDto } from '../dto/login-response.dto';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { RedisManager } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from 'src/common/constants/redis-client.constant';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/common/configs/app-config.interface';
import { AppConfigs } from 'src/common/constants/app.configs';
import { JwtService } from '@nestjs/jwt';
import { REDIS_KEYS } from 'src/common/constants/redis-keys.constant';
import ms from 'ms';
import { UserDto } from 'src/modules/user/dto/user.dto';
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisManager,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.redisClient = this.redisService.getClient(REDIS_CLIENT);
  }

  redisClient: Redis;

  async validateUserWithPassword({
    phoneNumber,
    password,
  }: {
    phoneNumber: string;
    password: string;
  }): Promise<User> {
    const user = await this.userService.findByPhoneNumber(phoneNumber);

    if (await compare(password, user.password)) {
      return user;
    }

    return;
  }

  async login(user: User): Promise<LoginResponseDto> {
    if (!user) return;
    const payload: JwtPayloadDto = {
      phoneNumber: user.phoneNumber,
      sub: user.id,
    };

    const refreshExpiresIn = this.configService.get<AppConfig>(
      AppConfigs.APP,
    ).refreshTokenExpireTime;

    const result = new LoginResponseDto({
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: refreshExpiresIn,
        secret: this.configService.get<AppConfig>(AppConfigs.APP).refreshSecret,
      }),
      user: new UserDto(user),
    });
    await this.redisClient.set(
      REDIS_KEYS.REFRESH({
        phoneNumber: user.phoneNumber,
        refreshToken: result.refreshToken,
      }),
      '1',
      'EX',
      ms(refreshExpiresIn) / 1000,
    );
    return result;
  }

  async refresh({
    refreshToken,
    user,
  }: {
    refreshToken: string;
    user: User;
  }): Promise<Omit<LoginResponseDto, 'user'>> {
    if (
      '1' ===
      (await this.redisClient.get(
        REDIS_KEYS.REFRESH({ phoneNumber: user.phoneNumber, refreshToken }),
      ))
    ) {
      await this.redisClient.del(
        REDIS_KEYS.REFRESH({ phoneNumber: user.phoneNumber, refreshToken }),
      );
      return this.login(user);
    }
    throw new BadRequestException('invalid token');
  }
}
