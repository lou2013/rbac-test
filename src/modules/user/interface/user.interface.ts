import { UserRole } from 'src/common/enum/user-role.enum';

export interface UserInterface {
  username: string;

  firstName: string;

  lastName: string;

  password: string;

  phoneNumber: string;

  roles: UserRole[];
}
