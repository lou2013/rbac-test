import { Expose } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';
import { UserRole } from 'src/common/enum/user-role.enum';
import { UserInterface } from '../interface/user.interface';

export class UserDto extends BaseDto implements UserInterface {
  @IsString()
  @MinLength(5)
  @Expose()
  username: string;

  @IsString()
  @MinLength(5)
  @Expose()
  firstName: string;

  @IsString()
  @MinLength(5)
  @Expose()
  lastName: string;

  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @Expose({ toClassOnly: true })
  @MinLength(8)
  @MaxLength(20)
  @IsString()
  password: string;

  @Expose()
  @IsString()
  @IsPhoneNumber('IR')
  phoneNumber: string;

  @Expose()
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];

  constructor(data: Partial<UserDto>) {
    super(data);
    Object.assign(this, data);
  }
}
