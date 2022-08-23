import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { authDto } from './dto/auth.dto';
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
}
