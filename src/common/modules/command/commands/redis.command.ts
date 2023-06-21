import { RedisManager } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { Command, CommandRunner, SubCommand } from 'nest-commander';
import { REDIS_CLIENT } from 'src/common/constants/redis-client.constant';

@SubCommand({ name: 'flushAll' })
export class RedisFlushAllSubCommand extends CommandRunner {
  constructor(private readonly redisService: RedisManager) {
    super();
    this.redisClient = this.redisService.getClient(REDIS_CLIENT);
  }

  name: 'flushAll';

  redisClient: Redis;

  async run(
    passedParameters: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    try {
      console.log('redis flushall');
      await this.redisClient.flushall();
    } catch (error) {
      console.log(error);
    }
  }
}

@Command({
  name: 'redis',
  subCommands: [RedisFlushAllSubCommand],
})
export class RedisRunner extends CommandRunner {
  async run(inputs: string[], options: Record<string, any>): Promise<void> {}
}
