import { Routes } from '@nestjs/core';
import { AuthModule } from './auth/auth-module';
import { UserModule } from './user/user.module';

export const V1Routes: Routes = [
  { path: '/auth', module: AuthModule },
  { path: '/user', module: UserModule },
];
