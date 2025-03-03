import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthCookieKey, AuthStrategyName } from '../constant';
import { AuthService } from '../auth.service';
import { AccessTokenPayload, AuthenticatedUser } from '../types';
import { SecurityConfig } from '../../config/SecurityConfig';
import { fromCookieAsJwt } from '../jwt.cookie.extractor';
import { Request } from 'express';
import { User } from '@prisma/client';

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

  async validate(
    request: Request,
    payload: AccessTokenPayload,
  ): Promise<AuthenticatedUser> {
    const refreshToken = fromCookieAsJwt(AuthCookieKey.JWT_REFRESH_TOKEN)(
      request,
    );

    const userId = payload.impersonatedSub || payload.sub;
    const user = (await this.authService.validateUserByRefreshToken(
      refreshToken,
      userId,
    )) as Omit<User, 'password'>;

    if (payload.impersonatedSub) {
      return {
        ...user,
        isImpersonated: true,
        impersonatedBy: payload.sub,
      };
    }
    return user;
  }
}
