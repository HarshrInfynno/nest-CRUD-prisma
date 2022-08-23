import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { compareTexts } from 'src/utils/helpers';
import { PrismaService } from 'src/utils/prisma.service';
import { authDto, AuthResponseType, IJwtTokenData } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  hello(): string {
    return 'hello';
  }
  async validateUser(email: string): Promise<User> {
    return await this.userService.findOne({
      email,
    });
  }

  async generateAuthData(user: User): Promise<AuthResponseType> {
    const payload: IJwtTokenData = {
      email: user.email,
      userId: user.id,
    };
    const token: string = this.jwtService.sign(payload);
    return {
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
      },
    };
  }

  async login(data: authDto) {
    const user = await this.userService.findUnique({
      email: data.email,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const doesPasswordMatch = await compareTexts(data.password, user.password);
    if (!doesPasswordMatch) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }

    return await this.generateAuthData(user);
  }
}
