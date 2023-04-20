import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Etf')
export default class EtfEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
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
