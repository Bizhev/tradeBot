import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import AccountEntity from './account.entity';
import { BaseEntityService } from '../../services/BaseEntity.service';

@Entity('User')
export default class UserEntity extends BaseEntityService {
  @OneToMany(() => AccountEntity, (account) => account.user)
  accounts: AccountEntity[];

  @Column()
  fio: string;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: number;

  @Column({ default: '' })
  token: string;

  @Column({ default: 0 })
  cash: number;
}
