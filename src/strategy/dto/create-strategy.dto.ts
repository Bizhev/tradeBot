import {StrategyNameEnum} from "../../types/common";
import {Column} from "typeorm";

export class CreateStrategyDto {
    // Название стратегии
    name: StrategyNameEnum;
    stopLosePercent: number;
    notStopLosePercent: number;
    priceLosePercentThenBuy: number;
    useSaleStair: boolean
    saleFullPercent: number
    takeProfitPercent: number;
    isActive?: boolean;
    profitStrategy: number;
    profitStrategyCommission: number;
}
