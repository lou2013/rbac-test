import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { DatabaseModule } from 'src/common/modules/database/database.module';
import { AuthModule } from './auth/auth-module';
import { UserModule } from './user/user.module';
import { V1Routes } from './v1.routes';

@Module({
  imports: [
    RouterModule.register(V1Routes),
    UserModule,
    AuthModule,
    DatabaseModule,
  ],
})
export class V1Module {}
