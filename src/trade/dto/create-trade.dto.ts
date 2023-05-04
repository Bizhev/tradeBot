import { Column, ManyToOne } from 'typeorm';
import { Strategy } from '../../strategy/entities/strategy.entity';
import AccountEntity from '../../user/entities/account.entity';
import StockEntity from '../../tool/entities/stock.entity';
import BondEntity from '../../tool/entities/bond.entity';
import EtfEntity from '../../tool/entities/etf.entity';
import CurrencyEntity from '../../tool/entities/currency.entity';
import {
  StrategyNameEnum,
  TradeCurrency,
  TradeStatusEnum,
} from '../../types/common';

export class CreateTradeDto {
  strategy: StrategyNameEnum;
  brokerAccountId: string;
  tool: string;
  name: string;
  lots?: number;
  from?: string;
  description: string;
  priceStartStrategy: number;
  priceAverage?: number;
  priceStarted?: number;
  status: TradeStatusEnum;
  type: string;
  price?: number;
  balance?: number;
  currency?: TradeCurrency;
}
