import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth-module';
import { UserController } from './controller/user.controller';
import { UserFactory } from './entity/user-factory.helper';
import { UserModel, UserSchema } from './model/user.model';
import { UserService } from './service/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserFactory],
  exports: [UserService],
})
export class UserModule {}
