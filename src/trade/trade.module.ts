import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { UserModule } from '../user/user.module';
import { ApiModule } from '../api/api.module';
import { StrategyModule } from '../strategy/strategy.module';
import { ToolModule } from '../tool/tool.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './entities/trade.entity';
import { CurrencyTradeModule } from '../currency-trade/currency-trade.module';
import { CurrencyTradeService } from '../currency-trade/currency-trade.service';
import { CurrencyTrade } from '../currency-trade/entities/currency-trade.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trade, CurrencyTrade]),
    UserModule,
    ApiModule,
    StrategyModule,
    ToolModule,
    CurrencyTradeModule,
  ],
  controllers: [TradeController],
  providers: [TradeService, CurrencyTradeService],
})
export class TradeModule {}
