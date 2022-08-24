import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { authDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getHello(): string {
    return this.authService.hello();
  }
  @Post('login')
  async login(@Body() data: authDto) {
    const authData = await this.authService.login(data);

    return {
      message: 'Login success',
      data: authData,
    };
  }

  @Post('forgot')
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    const forgotData = await this.authService.forgotPassword({
      email: data.email,
    });
    return {
      message: 'Link to reset password sent.',
      forgotData,
    };
  }

  @Post('reset')
  async resetPassword(@Body() data: ResetPasswordDto, @Req() req: Request) {
    const { password, cpassword } = data;
    const { token } = req.query;
    await this.authService.resetPassword({
      token,
      password,
      cpassword,
    });
    return {
      message: 'Password changed.',
    };
  }
}
