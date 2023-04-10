import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
