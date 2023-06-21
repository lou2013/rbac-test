import { Module } from '@nestjs/common';
import { AppRunner } from './commands/app.command';
import {
  DataBaseRunner,
  MongodbSeedSubCommand,
} from './commands/database.command';
import { RedisFlushAllSubCommand, RedisRunner } from './commands/redis.command';

@Module({
  controllers: [],
  providers: [
    AppRunner,
    DataBaseRunner,
    MongodbSeedSubCommand,
    RedisFlushAllSubCommand,
    RedisRunner,
  ],
  exports: [
    AppRunner,
    DataBaseRunner,
    RedisFlushAllSubCommand,
    MongodbSeedSubCommand,
    RedisRunner,
  ],
})
export class CommandModule {}
