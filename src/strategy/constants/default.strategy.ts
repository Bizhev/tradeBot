import { StrategyNameEnum } from '../../types/common';

export const defaultStrategy = {
  name: StrategyNameEnum.Default,
  stopLosePercent: 0,
  notStopLosePercent: 0,
  priceLosePercentThenBuy: 0,
  useSaleStair: true,
  saleFullPercent: 20,
  takeProfitPercent: 10,
};
