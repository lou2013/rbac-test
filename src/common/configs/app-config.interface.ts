import { StringValue } from 'ms';

export interface AppConfig {
  name: string;
  description: string;
  debug: boolean;
  version: string;
  secret: string;
  tokenExpireTime: StringValue;
  refreshSecret: string;
  refreshTokenExpireTime: StringValue;
  environment: string;
}
