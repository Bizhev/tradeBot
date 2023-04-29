import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import StockEntity from '../../tool/entities/stock.entity';

@Entity('Event')
export default class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StockEntity, (stock) => stock.events)
  stock: StockEntity;

  @Column()
  name: string;

  @Column({ default: '' })
  ticker: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
