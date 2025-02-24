import { Configuration, Value } from '@itgorillaz/configify/dist';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { StringValue } from '../utils/ms';

const stringToBoolean = (value: string) => ['1', 'true'].includes(value);

@Configuration()
export class SecurityConfig {
  @IsString()
  @IsNotEmpty()
  @Value('JWT_SECRET')
  jwtSecret: string;

  @IsString()
  @IsNotEmpty()
  @Value('REFRESH_TOKEN_SECRET')
  jwtRefreshSecret: string;

  @IsString()
  @Value('JWT_EXPIRES_IN', { default: '1hr' })
  jwtExpiresIn: StringValue;

  @IsString()
  @Value('REFRESH_TOKEN_EXPIRES_IN', { default: '7d' })
  jwtRefreshExpiresIn: StringValue;

  @IsBoolean()
  @Value('SECURE_COOKIE', {
    default: true,
    parse: stringToBoolean,
  })
  isSecureCookie: boolean;
}
