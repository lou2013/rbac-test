import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserFactory } from '../entity/user-factory.helper';
import { User } from '../entity/user.entity';
import { UserServiceInterface } from '../interface/user-service.interface';
import { UserModel } from '../model/user.model';
import { hashData } from '../helpers/hash-password.helper';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @InjectModel(UserModel.name)
    readonly userModel: PaginateModel<User>,
    private readonly userFactory: UserFactory,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    data.password = await hashData(data.password);
    const result = await this.userModel.create(data);
    return this.userFactory.create(result?.toJSON());
  }

  async findById(id: string): Promise<User> {
    const result = await this.userModel.findById(id);
    return this.userFactory.create(result?.toJSON());
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User> {
    const result = await this.userModel.findOne({ phoneNumber });
    return this.userFactory.create(result?.toJSON());
  }
}
