import { forwardRef, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CaslAbilityFactory } from 'src/common/casl/casl-ability.factory';
import { AppConfig } from 'src/common/configs/app-config.interface';
import { AppConfigs } from 'src/common/constants/app.configs';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './controller/authentication.controller';
import { AuthenticationService } from './service/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Global()
@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<AppConfig>(AppConfigs.APP).secret,
        signOptions: {
          expiresIn: configService.get<AppConfig>(AppConfigs.APP)
            .tokenExpireTime,
        },
      }),
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    JwtStrategy,
    RefreshStrategy,
    LocalStrategy,
    CaslAbilityFactory,
  ],
  exports: [CaslAbilityFactory],
})
export class AuthModule {}
