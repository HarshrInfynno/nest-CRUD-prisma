import { IsEmail, IsNotEmpty } from 'class-validator';

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
