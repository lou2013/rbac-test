import { ConfigService } from '@nestjs/config';
import { Seeder } from 'mongo-seeding';
import { DeepPartial } from 'mongo-seeding/dist/common';
import { Command, CommandRunner, Option, SubCommand } from 'nest-commander';
import { join, resolve } from 'node:path';
import { MongoClientOptions } from 'mongodb';
import { MongodbConfig } from 'src/common/configs/mongo.config';
import { AppConfigs } from 'src/common/constants/app.configs';
const mainDataRoute = join(process.cwd(), 'db', 'mongo', 'data');
// can be different
const testDataRoute = join(process.cwd(), 'db', 'mongo', 'data');

@SubCommand({ name: 'seed', arguments: '' })
export class MongodbSeedSubCommand extends CommandRunner {
  constructor(private readonly configService: ConfigService) {
    super();

    this.dataRoute = this.isTest ? testDataRoute : mainDataRoute;
  }

  mongoConfig: MongodbConfig;

  get isTest(): boolean {
    return process.env.NODE_ENV === 'test';
  }

  dataRoute: string;

  @Option({
    flags: '--drop-database',
    description: 'drop database',
    defaultValue: false,
  })
  dropDatabase(): boolean {
    return true;
  }

  @Option({
    flags: '--drop-collections',
    description: 'drop collections',
    defaultValue: false,
  })
  dropCollections(): boolean {
    return true;
  }

  @Option({
    flags: '--environment-tag [string]',
    description: 'environment tag',
    defaultValue: 'dev',
  })
  environmentTag(value): string {
    return value;
  }

  async run(
    passedParameters: string[],
    options?: {
      dropDatabase: boolean;
      dropCollections: boolean;
      environmentTag: string;
      configPath: string;
    },
  ): Promise<void> {
    this.mongoConfig = this.configService.get<MongodbConfig>(
      AppConfigs.MONGO_MAIN,
    );

    try {
      const mongoClientOptions: DeepPartial<MongoClientOptions> = {};
      const seeder = new Seeder({
        database: this.mongoConfig.url,
        dropDatabase: options.dropDatabase,
        dropCollections: options.dropCollections,
        collectionInsertManyOptions: { ordered: false },
        mongoClientOptions,
      });

      const collections = await seeder.readCollectionsFromPath(
        resolve(this.dataRoute),
        {
          extensions: ['js', 'json'],
        },
      );

      if (!this.isTest) {
        for (const collection of collections) {
          const documentResult = [];
          for (const data of collection.documents) {
            if (((data as any)?.tags ?? []).includes(options.environmentTag)) {
              documentResult.push(...((data as any)?.data ?? []));
            }
          }
          collection.documents = documentResult;
        }
      }

      await seeder.import(collections);
      console.log(`Seeded ${collections.length} collections`);
    } catch (error) {
      console.log(error);
    }
  }
}

@Command({
  name: 'db',
  subCommands: [MongodbSeedSubCommand],
})
export class DataBaseRunner extends CommandRunner {
  async run(inputs: string[], options: Record<string, any>): Promise<void> {}
}
