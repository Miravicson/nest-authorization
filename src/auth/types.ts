import { Request } from 'express';
import { User } from '@prisma/client';

export interface AccessTokenPayload {
  sub: number;
  impersonatedSub?: number;
  iat: number;
  exp?: number;
}

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  impersonatedUserAccessToken?: string;
}

export interface AuthenticatedUser extends Omit<User, 'password'> {
  isImpersonated?: boolean;
  impersonatedBy?: number;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
  cookies: Record<string, string>;
}
