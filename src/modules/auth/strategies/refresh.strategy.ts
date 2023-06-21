import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/service/user.service';
import { AppConfig } from 'src/common/configs/app-config.interface';
import { AppConfigs } from 'src/common/constants/app.configs';
import { User } from 'src/modules/user/entity/user.entity';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromBodyField('refreshToken'),
        ExtractJwt.fromHeader('refresh-token'),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<AppConfig>(AppConfigs.APP).refreshSecret,
    });
  }

  async validate(payload: JwtPayloadDto): Promise<User> {
    const user = await this.userService.findById(payload.sub);
    return user;
  }
}
