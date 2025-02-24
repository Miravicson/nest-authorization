import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from '@prisma/client';
import { AuthStrategyName } from '../constant';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  AuthStrategyName.LOCAL,
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string): Promise<User> {
    return await this.authService.validateUser(email, password);
  }
}
