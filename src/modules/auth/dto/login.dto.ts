import { Expose } from 'class-transformer';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class LoginDto {
  @IsPhoneNumber('IR')
  @IsString()
  @IsNotEmpty()
  @Expose()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  password: string;
}
