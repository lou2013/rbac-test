import { Injectable } from '@nestjs/common';
import { UserInterface } from '../interface/user.interface';
import { User } from './user.entity';
@Injectable()
export class UserFactory {
  create(data: UserInterface): User {
    return data ? new User(data) : undefined;
  }

  createMany(data: UserInterface[]): User[] {
    return data.map((d) => new User(d));
  }
}
