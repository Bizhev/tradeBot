import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Bond')
export default class BondEntity {
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
  faceValue: number;
  @Column()
  lot: number;
  @Column()
  currency: string;
  @Column()
  name: string;
  @Column()
  type: 'Bond';
  @Column({ default: false })
  isDeleted: boolean;
  // Дата создания записи
  @CreateDateColumn()
  created_at: Date;

  // Дата изменения записи
  @UpdateDateColumn()
  updated_at: Date;
}
