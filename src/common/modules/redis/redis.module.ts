import { Global, Module } from '@nestjs/common';
import { RedisModule as RedisInternalModule } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';
import { AppConfigs } from '../../constants/app.configs';
import { RedisConfig } from 'src/common/configs/redis-config.interface';

@Global()
@Module({
  imports: [
    RedisInternalModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const clients = [configService.get<RedisConfig>(AppConfigs.REDIS)];
        return {
          config: clients.map((client) => ({
            namespace: client.name,
            name: client.name,
            db: client.db,
            host: client.host,
            keyPrefix: client.keyPrefix,
            password: client.password,
            port: client.port,
            username: client.username,
          })),
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class RedisModule {}
