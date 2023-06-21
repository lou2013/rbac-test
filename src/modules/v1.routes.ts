import { Routes } from '@nestjs/core';
import { AuthModule } from './auth/auth-module';
import { CommentModule } from './comment/comment.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/producct.module';
import { UserModule } from './user/user.module';

export const V1Routes: Routes = [
  { path: '/auth', module: AuthModule },
  { path: '/user', module: UserModule },
  { path: '/product', module: ProductModule },
  { path: '/order', module: OrderModule },
  { path: '/comment', module: CommentModule },
];
