import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Currency')
export default class CurrencyEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: '' })
  figi: string;

  @Column({ default: '' })
  isin: string;

  @Column({ default: '' })
  ticker: string;
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
  @Column({ default: false })
  isDeleted: boolean;
  // Дата создания записи
  @CreateDateColumn()
  created_at: Date;

  // Дата изменения записи
  @UpdateDateColumn()
  updated_at: Date;
}
