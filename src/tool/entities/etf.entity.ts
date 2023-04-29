import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Trade } from '../../trade/entities/trade.entity';

@Entity('Etf')
export default class EtfEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToMany(() => Trade, (trade) => trade.tool)
  trades: Trade[];

  @Column({ unique: true })
  figi: string;
  @Column()
  ticker: string;
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

  @Column({ default: false })
  isDeleted: boolean;

  @Column()
  type: string;
  // Дата создания записи
  @CreateDateColumn()
  created_at: Date;

  // Дата изменения записи
  @UpdateDateColumn()
  updated_at: Date;
}
