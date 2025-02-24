import { Request } from 'express';
import { User } from '@prisma/client';

export interface AccessTokenPayload {
  sub: number;
  email: string;
  impersonatedUserEmail?: string;
  iat: number;
  exp?: number;
}

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  impersonatedUserAccessToken?: string;
}

export type AuthenticatedUser = Omit<User, 'password'>;

export interface SessionRequest extends Request {
  user: AuthenticatedSession;
  session?: AuthenticatedSession;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
  cookies: Record<string, string>;
}

export type AuthenticatedSession = {
  impersonatedUser: AuthenticatedUser;
  loggedInUser: AuthenticatedUser;
};
