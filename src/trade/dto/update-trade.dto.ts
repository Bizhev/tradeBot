import { PartialType } from '@nestjs/mapped-types';
import { CreateTradeDto } from './create-trade.dto';
import {
  OrderOperationType,
  StrategyNameEnum,
  TODO_ANY,
  TradeCurrency,
  TradeStatusEnum,
} from '../../types/common';

export class UpdateTradeDto extends PartialType(CreateTradeDto) {
  strategy?: StrategyNameEnum;
  name: string;
  lots: number;
  description: string;
  status?: TradeStatusEnum;
  priceAverage?: number;
  operation?: OrderOperationType;
  price: number;
  balance?: number;
  currency?: TradeCurrency;

  // orderId?: TODO_ANY;
  // endTradeDate?: TODO_ANY;
}
