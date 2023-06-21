import { Command, CommandRunner } from 'nest-commander';

@Command({
  name: 'run',
  options: { isDefault: true },
})
export class AppRunner extends CommandRunner {
  async run(inputs: string[], options: Record<string, any>): Promise<void> {}
}
