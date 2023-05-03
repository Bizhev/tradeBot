import { Module } from '@nestjs/common';
import { CurrencyTradeService } from './currency-trade.service';
import { CurrencyTradeController } from './currency-trade.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyTrade } from './entities/currency-trade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyTrade])],
  controllers: [CurrencyTradeController],
  providers: [CurrencyTradeService],
  exports: [CurrencyTradeModule],
})
export class CurrencyTradeModule {}
