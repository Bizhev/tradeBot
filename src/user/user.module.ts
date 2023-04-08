import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import UserEntity from './entities/user.entity';
import AccountEntity from './entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '../api/api.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, AccountEntity]), ApiModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
