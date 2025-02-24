import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedUser } from './types';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { ImpersonateUserDto } from './dto/impersonate-user.dto';
import { PoliciesGuard } from '../casl/policies.guard';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PolicyHandlers } from '../casl/policy-handler';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

export type RequestCtx = {
  request: Request;
  response: Response;
};

@Controller({ path: 'auth', version: '1' })
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Res({ passthrough: true }) response: Response,
    @Body()
    signupDto: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    },
  ) {
    const result = await this.authService.signup(signupDto, response);
    return result;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiCookieAuth()
  @HttpCode(HttpStatus.OK)
  async login(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) response: Response,
    @Body() _loginDto: LoginDto,
  ) {
    return await this.authService.login(user, response);
  }

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(PolicyHandlers.CAN_IMPERSONATE_USER)
  @ApiBearerAuth()
  @Post('impersonate')
  async impersonateUser(
    @Body() dto: ImpersonateUserDto,
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.impersonateUser(
      {
        impersonatedUserId: dto.impersonateUserId,
        user,
      },
      response,
    );
  }

  @UseGuards(JwtRefreshAuthGuard)
  @ApiBearerAuth()
  @Post('refresh-token')
  async refreshToken(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(user, response);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  async getProfile(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AuthenticatedUser> {
    return user;
  }

  @Post('logout')
  @ApiNoContentResponse()
  @HttpCode(204)
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    this.authService.logout(user, response);
  }
}
