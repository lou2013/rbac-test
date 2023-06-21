import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { DatabaseModule } from 'src/common/modules/database/database.module';
import { AuthModule } from './auth/auth-module';
import { CommentModule } from './comment/comment.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/producct.module';
import { UserModule } from './user/user.module';
import { V1Routes } from './v1.routes';

@Module({
  imports: [
    RouterModule.register(V1Routes),
    UserModule,
    AuthModule,
    DatabaseModule,
    CommentModule,
    OrderModule,
    ProductModule,
  ],
})
export class V1Module {}
