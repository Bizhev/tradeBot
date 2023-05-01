import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { UserModule } from '../user/user.module';
import { ApiModule } from '../api/api.module';
import { StrategyModule } from '../strategy/strategy.module';
import { ToolModule } from '../tool/tool.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './entities/trade.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trade]),
    UserModule,
    ApiModule,
    StrategyModule,
    ToolModule,
  ],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}
