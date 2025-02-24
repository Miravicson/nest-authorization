import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CaslModule } from '../casl/casl.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [CaslModule],
  exports: [UsersService],
})
export class UsersModule {}
