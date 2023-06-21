export const REDIS_KEYS = {
  REFRESH: ({
    phoneNumber,
    refreshToken,
  }: {
    phoneNumber: string;
    refreshToken: string;
  }): string => `authentication:${phoneNumber}:REFRESH:${refreshToken}`,
};
