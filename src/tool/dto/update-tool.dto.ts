import { PartialType } from '@nestjs/mapped-types';
import { CreateToolDto } from './create-tool.dto';

export class UpdateToolDto extends PartialType(CreateToolDto) {
  lot?: number;
  minPriceIncrement?: number;
  name?: string;
  type?: string;
  currency?: string;
  country?: string;
  ticker?: string;
  isDeleted?: boolean;
  lastPrice?: string;
  // lastDayMarketPrice: string;
}
