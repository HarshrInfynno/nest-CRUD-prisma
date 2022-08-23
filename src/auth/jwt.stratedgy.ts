import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IJwtTokenData } from './dto/auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'JFjsiab376q3agsdASjGHSFGJHA73rjasgf',
    });
  }

  async validate(payload: IJwtTokenData) {
    console.log(payload);
    if (!payload || !payload.email || !payload.userId) {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
    const user = await this.authService.validateUser(payload.email);

    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }

    return user;
  }
}
