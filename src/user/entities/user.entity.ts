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

@Entity('User')
export default class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @OneToMany(() => AccountEntity, (account) => account.user)
  // accounts: AccountEntity[];

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

  @Column({ default: '$' })
  cash_type: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
