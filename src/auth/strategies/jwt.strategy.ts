import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthCookieKey, AuthStrategyName } from '../constant';
import { AuthService } from '../auth.service';
import { AccessTokenPayload, AuthenticatedUser } from '../types';
import { SecurityConfig } from '../../config/SecurityConfig';
import { fromCookieAsJwt } from '../jwt.cookie.extractor';
import { User } from '@prisma/client';

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

  async validate(payload: AccessTokenPayload): Promise<AuthenticatedUser> {
    const userId = payload.impersonatedSub || payload.sub;
    const user = (await this.authService.jwtValidateUser(userId)) as Omit<
      User,
      'password'
    >;

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
