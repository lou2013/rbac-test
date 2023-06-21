import { readFileSync } from 'node:fs';
import * as yaml from 'js-yaml';
import { join } from 'node:path';

export const ymlLoader = () => {
  return yaml.load(
    readFileSync(join(process.cwd(), 'config', 'config.yml'), 'utf8'),
  ) as Record<string, any>;
};
