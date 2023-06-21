import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Collection } from 'src/common/enum/collection.enum';
import { UserRole } from 'src/common/enum/user-role.enum';
import { BaseModel } from 'src/common/model/base.model';
import { UserInterface } from '../interface/user.interface';
@Schema({ collection: Collection.USER })
export class UserModel extends BaseModel implements UserInterface {
  @Prop({ type: String })
  username!: string;

  @Prop({ type: String })
  firstName!: string;

  @Prop({ type: String })
  lastName!: string;

  @Prop({ type: String, unique: true })
  phoneNumber!: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: [String], default: [] })
  roles: UserRole[];
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
