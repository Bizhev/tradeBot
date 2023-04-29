import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import StockEntity from '../../tool/entities/stock.entity';

@Entity('Report')
export class ReportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StockEntity, (stock) => stock.reports)
  stock: StockEntity;

  /* Дополнительная информация */
  @Column({ default: '' })
  description: string;

  /* Прибыль на акцию */
  @Column({ default: null, type: 'float' })
  eps: number;

  /* Прибыль на акцию. Прогноз */
  @Column({ default: null, type: 'float' })
  eps_forecast: number;

  /* Доход */
  @Column({ default: null })
  revenue: number;

  /* Доход. Прогноз */
  @Column({ default: null })
  revenue_forecast: number;

  /** Квартал */
  @Column({ default: null })
  period_end: Date;

  // Дата отчета
  @Column({ default: null })
  release_data: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
