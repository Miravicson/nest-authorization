import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthCookieKey, AuthStrategyName } from '../constant';
import { AuthService } from '../auth.service';
import { AccessTokenPayload } from '../types';
import { SecurityConfig } from '../../config/SecurityConfig';
import { fromCookieAsJwt } from '../jwt.cookie.extractor';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  AuthStrategyName.JWT,
) {
  constructor(
    private authService: AuthService,
    securityConfig: SecurityConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        fromCookieAsJwt(AuthCookieKey.JWT_TOKEN),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: securityConfig.jwtSecret,
    });
  }

  async validate(payload: AccessTokenPayload) {
    return await this.authService.jwtValidateUser(payload.sub);
  }
}
