import { PartialType } from '@nestjs/mapped-types';
import { CreateCurrencyTradeDto } from './create-currency-trade.dto';

export class UpdateCurrencyTradeDto extends PartialType(
  CreateCurrencyTradeDto,
) {
  value: number;
  blocked: number;
  name: string;
}
