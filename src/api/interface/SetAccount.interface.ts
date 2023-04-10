import UserEntity from '../../user/entities/user.entity';

export interface SetAccountInterface {
  brokerAccountId?: string;
  userId?: number;
  brokerAccountType?: string;
  token: string;
}
