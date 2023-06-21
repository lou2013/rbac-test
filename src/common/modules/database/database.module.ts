import { Global, Module } from '@nestjs/common';
import { MongodbModule } from './mongo/mongodb.module';

@Global()
@Module({
  imports: [MongodbModule],
  exports: [MongodbModule],
})
export class DatabaseModule {}
