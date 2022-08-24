import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';
import { compareTexts, hashText } from 'src/utils/helpers';
import { PrismaService } from 'src/utils/prisma.service';
import {
  authDto,
  AuthResponseType,
  ForgotPasswordDto,
  IJwtTokenData,
  ResetPasswordDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private prisma: PrismaService,
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

  async forgotPassword(params: ForgotPasswordDto): Promise<void | any> {
    const { email } = params;
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
    const mailProps = {
      data: user,
      subject: 'test mail',
      template: 'email',
      context: {
        url: `${process.env.APP_URL}/auth/verify?userId=${
          user.id
        }&token=${'123'}`,
        name: user.firstName + ' ' + user.lastName,
      },
    };
    this.mailService.sendForgotPasswordMail(mailProps);
    const timeToken = await hashText(Date.now().toString());

    const data = {
      token: timeToken,
      userId: user.id,
    };
    const userExist = await this.prisma.token.findFirst({
      where: {
        userId: user.id,
      },
    });
    if (userExist) {
      return await this.prisma.token.update({
        where: {
          userId: user.id,
        },
        data,
      });
    } else {
      const storeToken = await this.prisma.token.create({ data });
      return storeToken;
    }
  }

  async resetPassword(params: {
    token: string | any;
    password: string;
    cpassword: string;
  }): Promise<void> {
    const { token, password, cpassword } = params;
    const tokenData = await this.prisma.token.findFirst({ where: { token } });
    if (!tokenData) {
      throw new HttpException('Invalid link', HttpStatus.UNAUTHORIZED);
    } else {
      if (password !== cpassword) {
        throw new HttpException(
          'Password not matching',
          HttpStatus.BAD_REQUEST,
        );
      }
      const updatePassword = await this.userService.update({
        data: {
          password,
        },
        where: {
          id: tokenData.userId,
        },
      });
    }
    await this.prisma.token.delete({ where: { token } });
  }
}
