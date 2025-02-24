import { SnakeToHyphen } from './set-metadata-key.enum';

export type JWTStrategyNames = Lowercase<keyof typeof AuthStrategyName>;

export const AuthStrategyName = {
  JWT: 'jwt',
  LOCAL: 'local',
  JWT_REFRESH: 'jwt-refresh',
} as const;

export type AuthCookieKey = SnakeToHyphen<keyof typeof AuthCookieKey>;
export const AuthCookieKey = {
  JWT_TOKEN: 'jwt-token',
  IMPERSONATED_USER_JWT_TOKEN: 'impersonated-user-jwt-token',
  JWT_REFRESH_TOKEN: 'refresh-token',
} as const;

