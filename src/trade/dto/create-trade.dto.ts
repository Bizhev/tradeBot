import { Column, ManyToOne } from 'typeorm';
import { Strategy } from '../../strategy/entities/strategy.entity';
import AccountEntity from '../../user/entities/account.entity';
import StockEntity from '../../tool/entities/stock.entity';
import BondEntity from '../../tool/entities/bond.entity';
import EtfEntity from '../../tool/entities/etf.entity';
import CurrencyEntity from '../../tool/entities/currency.entity';
import {
  OrderOperationType,
  StrategyNameEnum,
  TradeCurrency,
  TradeStatusEnum,
} from '../../types/common';
import { OperationTrade } from '@tinkoff/invest-openapi-js-sdk';

export class CreateTradeDto {
  strategy: StrategyNameEnum;
  brokerAccountId: string;
  name: string;
  status: TradeStatusEnum;
  type: string;
  tool?: string;
  lots?: number;
  from?: string;
  description?: string;
  priceStartStrategy?: number;
  priceAverage?: number;
  priceStarted?: number;
  price?: number;
  balance?: number;
  currency?: TradeCurrency;
  operation?: OrderOperationType;
}
