import { Module } from '@nestjs/common';
import { AppRunner } from './commands/app.command';
import {
  DataBaseRunner,
  MongodbSeedSubCommand,
} from './commands/database.command';

@Module({
  controllers: [],
  providers: [AppRunner, DataBaseRunner, MongodbSeedSubCommand],
  exports: [AppRunner, DataBaseRunner, MongodbSeedSubCommand],
})
export class CommandModule {}
