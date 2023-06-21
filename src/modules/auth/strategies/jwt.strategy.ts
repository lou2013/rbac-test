import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/service/user.service';
import { AppConfig } from 'src/common/configs/app-config.interface';
import { AppConfigs } from 'src/common/constants/app.configs';
import { User } from 'src/modules/user/entity/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<AppConfig>(AppConfigs.APP).secret,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validate(payload: any): Promise<User> {
    try {
      return await this.userService.findById(payload.sub);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
