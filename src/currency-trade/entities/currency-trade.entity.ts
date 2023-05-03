import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import AccountEntity from '../../user/entities/account.entity';

@Entity('CurrencyTrade')
export class CurrencyTrade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AccountEntity, (account) => account.currencyTrades)
  account: AccountEntity;

  @Column()
  name: string;

  @Column({ type: 'float' })
  value: number;

  @Column({ type: 'float', default: 0 })
  blocked: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
