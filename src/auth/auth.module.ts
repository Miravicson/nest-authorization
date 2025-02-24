import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from 'src/users/users.module';
import { SecurityConfig } from '../config/SecurityConfig';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

const ConfiguredJwtModule = JwtModule.registerAsync({
  global: true,
  useFactory: (securityConfig: SecurityConfig) => {
    return {
      secret: securityConfig.jwtSecret,
      signOptions: { expiresIn: securityConfig.jwtExpiresIn },
    };
  },
  inject: [SecurityConfig],
});

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, JwtRefreshStrategy],
  imports: [PassportModule, ConfiguredJwtModule, UsersModule],
  exports: [AuthService],
})
export class AuthModule {}
