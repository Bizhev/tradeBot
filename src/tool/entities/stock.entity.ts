import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Stock')
export default class StockEntity {
  @PrimaryGeneratedColumn()
  id: number;
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

  @Column({ unique: true })
  ticker: string;
  @Column({ default: false })
  isDeleted: boolean;

  // Дата создания записи
  @CreateDateColumn()
  created_at: Date;

  // Дата изменения записи
  @UpdateDateColumn()
  updated_at: Date;
}
