export interface TinekOptionInterface {
  // id в базе
  userId: number;
  // Может быть IIS или основной счет когда пустой.
  brokerAccountId: string;
  brokerAccountType: string;
  brokerAccountTypeDefault: string;
}
