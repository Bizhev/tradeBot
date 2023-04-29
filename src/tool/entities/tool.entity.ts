import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Tool')
export default class Tool {
  @PrimaryGeneratedColumn()
  id: number;

  // Привязка к валюте торгуемой
  @Column()
  currency: string;

  @Column({ unique: true })
  figi: string;

  @Column()
  isin: string;

  @Column({ default: 0, type: 'float' })
  minPriceIncrement: number;

  @Column()
  lot: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  country: string;

  @Column({ unique: false })
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
