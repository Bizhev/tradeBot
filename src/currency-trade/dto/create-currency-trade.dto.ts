import AccountEntity from '../../user/entities/account.entity';

export class CreateCurrencyTradeDto {
  account?: AccountEntity;
  name: string;
  value: number;
  blocked: number;
}
