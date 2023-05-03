import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import EventEntity from './event.entity';
import { ReportEntity } from '../../report/entities/report.entity';
import { Trade } from '../../trade/entities/trade.entity';

@Entity('Stock')
export default class StockEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ReportEntity, (report) => report.stock)
  reports: ReportEntity[];

  @OneToMany(() => EventEntity, (event) => event.stock)
  events: EventEntity[];

  @OneToMany(() => Trade, (trade) => trade.tool)
  trades: Trade[];

  @Column({ unique: true })
  figi: string;

  @Column()
  isin: string;

  @Column({ default: 0, type: 'float' })
  minPriceIncrement: number;

  @Column()
  lot: number;

  @Column()
  currency: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  country: string;

  @Column({ unique: false })
  ticker: string;

  @Column({ default: 0, type: 'float' })
  price: number;

  @Column({ default: false })
  isDeleted: boolean;

  // Дата создания записи
  @CreateDateColumn()
  created_at: Date;

  // Дата изменения записи
  @UpdateDateColumn()
  updated_at: Date;
}
