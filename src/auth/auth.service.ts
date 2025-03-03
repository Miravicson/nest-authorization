import * as bcrypt from 'bcrypt';

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { SignInResponse, AccessTokenPayload, AuthenticatedUser } from './types';
import { User } from '@prisma/client';

import { hashPassWord } from '../utils';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SecurityConfig } from 'src/config/SecurityConfig';
import ms, { StringValue } from 'src/utils/ms';
import { CookieOptions, Response } from 'express';
import { AppConfig } from 'src/config/AppConfig';
import { AuthCookieKey } from './constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly securityConfig: SecurityConfig,
    private readonly appConfig: AppConfig,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.usersService.findOneByEmail(email);
    const validated = user && (await bcrypt.compare(password, user.password));
    if (!validated) {
      throw new UnauthorizedException(`Username or password is incorrect`);
    }
    delete user.password;
    delete user.refreshToken;
    return user;
  }

  async jwtValidateUser(userId: number): Promise<AuthenticatedUser> {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException(`Username or password is incorrect`);
    }
    delete user.password;
    delete user.refreshToken;
    return user;
  }

  async validateUserByRefreshToken(refreshToken: string, userId: number) {
    const user = await this.usersService.findOne(userId);
    const validated =
      !!user && (await bcrypt.compare(user.refreshToken, refreshToken));
    if (!validated) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    delete user.password;
    delete user.refreshToken;
    return user;
  }

  async login(
    user: AuthenticatedUser,
    response: Response,
  ): Promise<SignInResponse> {
    return await this.signIn({ user, response });
  }

  async signIn({
    user,
    userToImpersonate,
    response,
  }: {
    user: AuthenticatedUser;
    userToImpersonate?: AuthenticatedUser;
    response: Response;
  }): Promise<SignInResponse> {
    const result = {} as SignInResponse;
    const jwtPayload: AccessTokenPayload = {
      sub: user.id,
      iat: Date.now(),
    };

    if (userToImpersonate) {
      jwtPayload.impersonatedSub = userToImpersonate.id;
    }

    result.accessToken = await this.jwtService.signAsync(jwtPayload);
    result.refreshToken = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: this.securityConfig.jwtRefreshExpiresIn,
      secret: this.securityConfig.jwtRefreshSecret,
    });

    await this.usersService.update(
      { id: user.id },
      { refreshToken: await hashPassWord(result.refreshToken) },
    );

    this.setJwtCookie({
      response,
      cookieKey: AuthCookieKey.JWT_TOKEN,
      token: result.accessToken,
      expiresIn: this.securityConfig.jwtExpiresIn,
    });
    this.setJwtCookie({
      response,
      cookieKey: AuthCookieKey.JWT_REFRESH_TOKEN,
      token: result.refreshToken,
      expiresIn: this.securityConfig.jwtRefreshExpiresIn,
    });
    return result;
  }

  async impersonateUser(
    options: {
      userToImpersonateId: number;
      user: AuthenticatedUser;
    },
    response: Response,
  ) {
    const { userToImpersonateId, user } = options;
    const userToImpersonate =
      await this.usersService.findOne(userToImpersonateId);
    if (!userToImpersonate) {
      throw new UnauthorizedException(
        `Could not find user with id ${userToImpersonateId}`,
      );
    }
    return await this.signIn({
      user,
      userToImpersonate,
      response,
    });
  }

  async stopImpersonation(impersonatedById: number, response: Response) {
    const impersonatingUser = await this.usersService.findOne(impersonatedById);

    if (!impersonatingUser) {
      throw new UnauthorizedException(
        'You are not allowed to stop impersonation',
      );
    }

    return await this.signIn({
      user: impersonatingUser,
      response,
    });
  }

  async signup(
    signupDto: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    },
    response: Response,
  ) {
    const existingUser = await this.usersService.findOneByEmail(
      signupDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('email already exists');
    }
    const createUserDto: CreateUserDto = {
      email: signupDto.email,
      password: await hashPassWord(signupDto.password),
      firstName: signupDto.firstName,
      lastName: signupDto.lastName,
    };
    const user = await this.usersService.create(createUserDto);
    return await this.signIn({ user, response });
  }

  async logout(user: AuthenticatedUser, response: Response) {
    await this.usersService.update({ id: user.id }, { refreshToken: null });
    this.setJwtCookie({
      response,
      cookieKey: AuthCookieKey.JWT_TOKEN,
      token: '',
      expiresIn: this.securityConfig.jwtExpiresIn,
      maxAge: 0,
    });
    this.setJwtCookie({
      response,
      cookieKey: AuthCookieKey.JWT_REFRESH_TOKEN,
      token: '',
      expiresIn: this.securityConfig.jwtRefreshExpiresIn,
      maxAge: 0,
    });
  }

  private setJwtCookie({
    response,
    token,
    cookieKey,
    maxAge,
    expiresIn,
  }: {
    response: Response;
    token: string;
    cookieKey: string;
    expiresIn: StringValue;
    maxAge?: number;
  }): void {
    const normalizedMaxAge = maxAge != null ? maxAge : ms(expiresIn);
    const secure = this.appConfig.nodeEnv === 'production';
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure,
      maxAge: normalizedMaxAge,
      path: '/',
      sameSite: 'strict', // need to specify this in order to work in chrome
    };
    response.cookie(cookieKey, token, cookieOptions);
  }
}
