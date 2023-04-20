import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('CurrencyTrade')
export default class CurrencyTradeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Связь между валютами, просто так
  @Column()
  ticker: string;

  // Тип валюты в инструментах
  @Column()
  currency: string;
  // Дата создания записи
  @CreateDateColumn()
  created_at: Date;

  // Дата изменения записи
  @UpdateDateColumn()
  updated_at: Date;
}
