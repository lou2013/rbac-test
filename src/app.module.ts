import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ymlLoader } from './common/helpers/yml-loader';
import { DatabaseModule } from './common/modules/database/database.module';
import { RedisModule } from './common/modules/redis/redis.module';
import { V1Module } from './modules/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ymlLoader],
    }),
    V1Module,
    RedisModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
