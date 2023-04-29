import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { UserModule } from '../user/user.module';
import { ApiModule } from '../api/api.module';

@Module({
  imports: [UserModule, ApiModule],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}
