import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  firstName?: string;

  @IsNotEmpty()
  lastName?: string;

  @IsNotEmpty()
  password: string;
  isActive?: boolean;
}

export class UserVerificationDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  firstName?: string;
  lastName?: string;
  password: string;
  isActive?: boolean;
}
