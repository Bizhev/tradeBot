import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import AccountEntity from '../../user/entities/account.entity';
import { Trade } from '../../trade/entities/trade.entity';
import {StrategyNameEnum} from "../../types/common";

@Entity('Strategy')
export class Strategy {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Trade, (trade) => trade.strategy)
  trades: Trade[];

  // Name of the strategy
  @Column({default: StrategyNameEnum.Test})
  name: StrategyNameEnum;

  /* Если ниже будет цена вот этой то продавать по текущим ценам
  Если 0 то вообще не продавать
   */
  @Column({ default: 0, type: 'float' })
  stopLosePercent: number;

  /** Если прибыль/убыток ниже этого процента от суммы,
     то не закрываем в убыток
   Если 0 то вообще не закрывать
   */
  @Column({ default: 0, type: 'float' })
  notStopLosePercent: number;

  /** If lower percent then buy
   * Если ниже этой суммы то покупаем.
   * */
  @Column({ type: 'float', default: 0 })
  priceLosePercentThenBuy: number;

  // Если выше то продаем
  @Column({ default: 0, type: 'float' })
  takeProfitPercent: number;

  // status strategy, START, PROCESS, END,
  @Column({ default: false })
  isActive: boolean

  // Используем лестничную продажу
  @Column({ default: false })
  useSaleStair: boolean;

  // При урожае в такой процент закрываем позицию полностью.
  @Column({ type: 'float', default: 0 })
  saleFullPercent: number

  // Полная прибыль стратегии
  @Column({ default: 0, type: 'float' })
  profitStrategy: number;

  // Все комиссии по этой стратегии
  @Column({ default: 0, type: 'float' })
  profitStrategyCommission: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
