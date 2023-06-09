import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import UserEntity from './user.entity';
import { Trade } from '../../trade/entities/trade.entity';
import CurrencyEntity from '../../tool/entities/currency.entity';
import { CurrencyTrade } from '../../currency-trade/entities/currency-trade.entity';
import { BaseEntityService } from '../../services/BaseEntity.service';
// import { Portfolio } from '../../portfolio/entities/portfolio.entity';
// import { Trade } from '../../trade/entities/trade.entity';
@Entity('Account')
export default class AccountEntity extends BaseEntityService {
  @ManyToOne(() => UserEntity, (user) => user.accounts)
  user: UserEntity;

  @OneToMany(() => Trade, (trade) => trade.account)
  trades: Trade[];

  @OneToMany(() => CurrencyTrade, (currencyTrade) => currencyTrade.account)
  currencyTrades: CurrencyTrade[];

  // @OneToMany((type) => Portfolio, (p) => p.account)
  // portfolio: Portfolio;

  // @OneToMany((type) => Trade, (trade) => trade.account)
  // trades: Trade[];

  // @Column({ default: 0 })
  // toolUsd: number;
  //
  // @Column({ default: 0 })
  // toolRub: number;
  //
  // @Column({ default: 0 })
  // freeUsd: number;
  //
  // @Column({ default: 0 })
  // toolEur: number;
  //
  // @Column({ default: 0 })
  // freeEur: number;
  //
  // @Column({ default: 0 })
  // freeRub: number;
  @Column()
  brokerAccountType: string;

  @Column({ default: false })
  active: boolean;

  @Column()
  brokerAccountId: string;

  // Общее количество инструментов
  // @Column({ default: 0 })
  // allCount: number;
}
