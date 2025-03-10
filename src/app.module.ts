import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CaslModule } from './casl/casl.module';
import { PrismaModule } from './prisma/prisma.module';

import { StoriesModule } from './stories/stories.module';
import { AuthModule } from './auth/auth.module';
import { ConfigifyModule } from '@itgorillaz/configify/dist';

@Module({
  imports: [
    ConfigifyModule.forRootAsync({
      configFilePath: './env',
    }),
    AuthModule,
    StoriesModule,
    UsersModule,
    CaslModule,
    PrismaModule,
  ],
})
export class AppModule {}
