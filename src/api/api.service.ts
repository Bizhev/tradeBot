import { Injectable } from '@nestjs/common';
import OpenAPI_, {
  Depth,
  FIGI,
  InstrumentType,
  MarketOrderRequest,
  PlacedMarketOrder,
  UserAccounts,
} from '@tinkoff/invest-openapi-js-sdk';
import { TinekOptionInterface } from './interface/TinekOption.interface';
import { format } from 'date-fns';
import { LogService } from '../services/Log.service';
import * as OpenAPI from '@tinkoff/invest-openapi-js-sdk';
import AccountEntity from '../user/entities/account.entity';

@Injectable()
export class ApiService extends LogService {
  constructor() {
    super('ApiService');
    this.log('API init');
  }
  apiURL = 'https://api-invest.tinkoff.ru/openapi';
  socketURL = 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws';
  isAuth = false;
  options: TinekOptionInterface = {
    userId: 0,
    // Может быть IIS или основной счет когда пустой.
    brokerAccountId: undefined,
    brokerAccountType: '',
    brokerAccountTypeDefault: 'Tinkoff',
  };
  api: typeof OpenAPI | any = null;

  async changeAccount({ userId, brokerAccountId, brokerAccountType, token }) {
    this.isAuth = false;
    try {
      this.options.userId = userId;
      this.options.brokerAccountId = brokerAccountId || '';
      this.options.brokerAccountType = brokerAccountType || '';

      if (this.apiURL && this.socketURL && token) {
        this.api = new OpenAPI_({
          apiURL: this.apiURL,
          secretToken: token,
          socketURL: this.socketURL,
          brokerAccountId: undefined,
        });
      }

      this.log(
        `Изменен account, ${this.options.brokerAccountId}(${this.options.userId}) - ${this.options.brokerAccountType}`,
      );
      this.isAuth = true;
    } catch (e) {
      this.log(`Ошибка при изменении аккаунта.`);
    }
  }
  async getAccounts(): Promise<AccountEntity[]> {
    const { accounts } = await this.api.accounts();
    const { brokerAccountId } = await accounts.find((name) => {
      return name.brokerAccountType === this.options.brokerAccountTypeDefault;
    });
    this.options.brokerAccountId = brokerAccountId;
    return accounts;
  }

  async useTokenOnly(token: string) {
    const result = {
      error: null,
      data: null,
    };
    try {
      const params = {
        apiURL: this.apiURL,
        secretToken: token,
        socketURL: this.socketURL,
        brokerAccountId: undefined,
      };
      if (this.apiURL && this.socketURL && token) {
        this.api = new (OpenAPI as any as typeof OpenAPI_)(params);
      }
      result.data = token;
    } catch (err) {
      console.error(err);
      result.error = err;
    }
    return result;
  }
}
