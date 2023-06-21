import { genSalt, hash } from 'bcrypt';

export async function hashData(data: string): Promise<string> {
  return await hash(data, await genSalt(15));
}
