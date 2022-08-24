import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Transform } from 'stream';

export class authDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
export class AuthUserType {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}
export class AuthResponseType {
  token: string;
  user: AuthUserType;
}
export interface IJwtTokenData {
  email: string;
  userId: number;
}
export class ForgotPasswordDto {
  @IsNotEmpty()
  email: string;
}
export class ResetPasswordDto {
  @IsNotEmpty()
  token: string | any;

  @IsNotEmpty()
  @Length(8, 20)
  password: string;

  @IsNotEmpty()
  @Length(8, 20)
  cpassword: string;
}
