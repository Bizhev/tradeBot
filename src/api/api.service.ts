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
import { LogService } from '../services/Log.service';
import * as OpenAPI from '@tinkoff/invest-openapi-js-sdk';
import AccountEntity from '../user/entities/account.entity';
import { SetAccountInterface } from './interface/SetAccount.interface';
import { OrderOperationType } from '../types/common';

@Injectable()
export class ApiService extends LogService {
  constructor() {
    super('ApiService');
    this.log('API init');
  }
  async test() {
    const tool = await this.api.portfolio();

    // const tool = await this.api.portfolio();
    console.log({ tool });
    return tool;
  }
  apiURL = 'https://api-invest.tinkoff.ru/openapi';
  socketURL = 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws';
  options: TinekOptionInterface = {
    userId: 0,
    // Может быть IIS или основной счет когда пустой.
    brokerAccountId: undefined,
    brokerAccountType: '',
    brokerAccountTypeDefault: 'Tinkoff',
  };
  api: typeof OpenAPI | any = null;

  /**
   * Меняет активный аккаунт. */
  async setAccount({
    brokerAccountId,
    userId,
    brokerAccountType,
    token,
  }: SetAccountInterface) {
    if (this.options.brokerAccountId !== brokerAccountId && brokerAccountId) {
      try {
        if (userId) this.options.userId = userId;
        this.options.brokerAccountId = brokerAccountId || '';
        this.options.brokerAccountType = brokerAccountType || '';

        const params = {
          apiURL: this.apiURL,
          secretToken: token,
          socketURL: this.socketURL,
          brokerAccountId,
        };
        if (this.apiURL && this.socketURL && token) {
          this.api = new (OpenAPI as any as typeof OpenAPI_)(params);
        }

        this.log(
          `Изменен account, ${this.options.brokerAccountId}(${this.options.userId}) - ${this.options.brokerAccountType}`,
        );
      } catch (error) {
        this.log(`Ошибка при изменении аккаунта:` + error);
      }
    } else {
      // this.warn('Тот же аккаунт');
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
  async fetchInstrumentsByType(type: InstrumentType) {
    if (type === 'Stock') {
      return await this.api.stocks();
    }
    if (type === 'Bond') {
      return await this.api.bonds();
    }
    if (type === 'Etf') {
      return await this.api.etfs();
    }
    if (type === 'Currency') {
      return await this.api.currencies();
    }
  }
  async getPortfolio() {
    return await this.api.portfolio();
  }
  async orderbookGet({ figi }) {
    //  Получение стака по фиги
    return this.api.orderbookGet({ figi });
  }
  async limitOrder({
    figi,
    lots,
    operation,
    price,
  }: {
    figi: string;
    lots: number;
    operation: OrderOperationType;
    price: number;
  }) {
    // Устонавливает активнуюзаявку
    return this.api.limitOrder({ figi, lots, operation, price });
  }
  async cancelOrder({ orderId }) {
    // отменяет активную заявку
    return this.api.cancelOrder({ orderId });
  }
  // Получаем все активные заявки
  async orders() {
    // отменяет активную заявку
    return this.api.orders();
  }
  async portfolioCurrencies() {
    // Метод для получения валютных активов клиента
    return this.api.portfolioCurrencies();
  }
}
