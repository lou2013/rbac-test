import { ReturnType } from 'src/common/types/method-return.type';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entity/user.entity';

export interface UserServiceInterface {
  create(data: CreateUserDto): ReturnType<User>;
  findById(id: string): ReturnType<User>;
}
