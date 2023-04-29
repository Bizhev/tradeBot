import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import UserEntity from '../../user/entities/user.entity';
import { Strategy } from '../../strategy/entities/strategy.entity';
import AccountEntity from '../../user/entities/account.entity';
import StockEntity from '../../tool/entities/stock.entity';
import BondEntity from '../../tool/entities/bond.entity';
import EtfEntity from '../../tool/entities/etf.entity';
import CurrencyEntity from '../../tool/entities/currency.entity';
import {TradeStatusEnum} from "../../types/common";

@Entity('Trade')
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Strategy, (strategy) => strategy.trades)
  strategy: Strategy;

  @ManyToOne(() => AccountEntity, (account) => account.trades)
  account: AccountEntity;

  @ManyToOne(
    () => StockEntity || BondEntity || EtfEntity || CurrencyEntity,
    (tool) => tool.figi,
  )
  tool: StockEntity | BondEntity | EtfEntity | CurrencyEntity;

  // latin name, group_name
  @Column({ default: 'others' })
  name: string;

  // notice, description
  @Column({ default: '' })
  description: string;

  @Column({ default: 0 })
  status: TradeStatusEnum;

  /** какой цены начать позицию */
  @Column({ type: 'float' })
  priceStartStrategy: number;

  /** Maximum price */
  @Column({ type: 'float' })
  priceMax: number;

  // С какой цены начали работу
  @Column({ default: 0, type: 'float' })
  priceStarted: number;

  // Начала работы торговлю, указывается автоматом
  @Column()
  startTradeDate: Date;

  // Закончил Торговлю
  @Column()
  endTradeDate: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
