export const REDIS_KEYS = {
  REFRESH: ({
    email,
    refreshToken,
  }: {
    email: string;
    refreshToken: string;
  }): string => `authentication:${email}:REFRESH:${refreshToken}`,
};
