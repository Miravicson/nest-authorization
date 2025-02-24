import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthCookieKey, AuthStrategyName } from '../constant';
import { AuthService } from '../auth.service';
import { AccessTokenPayload } from '../types';
import { SecurityConfig } from '../../config/SecurityConfig';
import { fromCookieAsJwt } from '../jwt.cookie.extractor';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  AuthStrategyName.JWT_REFRESH,
) {
  constructor(
    private authService: AuthService,
    securityConfig: SecurityConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        fromCookieAsJwt(AuthCookieKey.JWT_REFRESH_TOKEN),
      ]),
      secretOrKey: securityConfig.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: AccessTokenPayload) {
    const refreshToken = fromCookieAsJwt(AuthCookieKey.JWT_REFRESH_TOKEN)(request);
    return await this.authService.validateUserByRefreshToken(refreshToken, payload.sub);
  }
}
