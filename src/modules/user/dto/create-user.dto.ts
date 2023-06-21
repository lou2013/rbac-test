import { Expose } from 'class-transformer';
import { UserDto } from './user.dto';

export class CreateUserDto extends UserDto {
  @Expose()
  password: string;

  constructor(data: Partial<CreateUserDto>) {
    super(data);
    Object.assign(this, data);
  }
}
