import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from '../service/auth.service';
import { User } from 'src/modules/user/entity/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthenticationService) {
    super({ usernameField: 'phoneNumber' });
  }

  async validate(phoneNumber: string, password: string): Promise<User> {
    try {
      const user = await this.authService.validateUserWithPassword({
        phoneNumber,
        password,
      });

      return user;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
