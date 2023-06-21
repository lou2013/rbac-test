import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
// import { IdPlugin } from "./plugins/mongo-id.Plugin";
import * as paginatePlugin from 'mongoose-paginate-v2';
import { TimestampPlugin } from './plugins/mongo-timestamp.Plugin';
import { AppConfigs } from '../../../constants/app.configs';
import { IdPlugin } from './plugins/mongo-id.Plugin';
import { MongodbConfig } from 'src/common/configs/mongo.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        //TODO remove test config from here
        const config =
          configService.get<string>('NODE_ENV') === 'test'
            ? configService.get<MongodbConfig>(AppConfigs.MONGO_TEST)
            : configService.get<MongodbConfig>(AppConfigs.MONGO_MAIN);

        return {
          uri: config.url,
          autoIndex: true,
          connectionFactory: (connection) => {
            connection.plugin(IdPlugin);
            connection.plugin(TimestampPlugin);
            connection.plugin(paginatePlugin);
            return connection;
          },
        };
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class MongodbModule {}
