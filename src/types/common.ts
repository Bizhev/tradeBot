// Позже это всегда исправляется
import StockEntity from '../tool/entities/stock.entity';
import BondEntity from '../tool/entities/bond.entity';
import EtfEntity from '../tool/entities/etf.entity';
import CurrencyEntity from '../tool/entities/currency.entity';

export type TODO_ANY = any;
export enum TradeStatusEnum {
  Process = 1, // В процессе
  End = 0, // закончен, завершил
}

export enum StrategyNameEnum {
  Invest = 'investing', // В процессе
  Default = 'default', // дефолтная стратегия
}

export type ToolType = StockEntity | BondEntity | EtfEntity | CurrencyEntity;

// Operations
export enum OrderOperationType {
  Sell = 'Sell',
  Buy = 'Buy',
}

export enum TradePortfolioFrom {
  Portfolio = 'portfolio',
}
export enum TradeCurrency {
  RUB = 'RUB',
  USD = 'USD',
  CNY = 'CNY',
}
