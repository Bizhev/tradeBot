import { PartialType } from '@nestjs/mapped-types';
import { CreateTradeDto } from './create-trade.dto';
import { StrategyNameEnum, TradeStatusEnum } from '../../types/common';

export class UpdateTradeDto extends PartialType(CreateTradeDto) {
  strategy: StrategyNameEnum;
  brokerAccountId: string;
  tool: string;
  name: string;
  description: string;
  priceStartStrategy: number;
  status: TradeStatusEnum;
}
