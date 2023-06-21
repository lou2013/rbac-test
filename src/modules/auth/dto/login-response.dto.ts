import { Expose, Type } from 'class-transformer';
import { UserDto } from 'src/modules/user/dto/user.dto';

export class LoginResponseDto {
  @Expose()
  accessToken?: string;

  @Expose()
  refreshToken?: string;

  @Expose()
  @Type(() => UserDto)
  user?: UserDto;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}
