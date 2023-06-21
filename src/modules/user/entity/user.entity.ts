import { BaseEntity } from 'src/common/entity/base.entity';
import { UserRole } from 'src/common/enum/user-role.enum';
import { UserInterface } from '../interface/user.interface';

export class User extends BaseEntity implements UserInterface {
  username: string;

  password: string;

  firstName: string;

  lastName: string;

  phoneNumber: string;

  roles: UserRole[];

  constructor(data: Partial<User>) {
    super(data);
    Object.assign(this, data);
  }
}
