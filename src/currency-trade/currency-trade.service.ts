import { Injectable } from '@nestjs/common';
import { CreateCurrencyTradeDto } from './dto/create-currency-trade.dto';
import { UpdateCurrencyTradeDto } from './dto/update-currency-trade.dto';
import { LogService } from '../services/Log.service';
import AccountEntity from '../user/entities/account.entity';
import { PortfolioCurrenciesResponse } from '@tinkoff/invest-openapi-js-sdk';
import { Currencies } from '@tinkoff/invest-openapi-js-sdk/build/domain';
import { TODO_ANY } from '../types/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyTrade } from './entities/currency-trade.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CurrencyTradeService extends LogService {
  constructor(
    @InjectRepository(CurrencyTrade)
    private readonly currencyTrade: Repository<CurrencyTrade>,
  ) {
    super('CurrencyTrade');
  }
  async create(createCurrencyTradeDto: CreateCurrencyTradeDto) {
    const cur = new CreateCurrencyTradeDto();
    cur.account = createCurrencyTradeDto.account;
    cur.name = createCurrencyTradeDto.name;
    cur.value = createCurrencyTradeDto.value;
    cur.blocked = createCurrencyTradeDto.blocked;
    return this.currencyTrade.save(cur);
  }

  findAll() {
    return `This action returns all currencyTrade`;
  }

  findOne(id: number) {
    return `This action returns a #${id} currencyTrade`;
  }

  update(id: number, updateCurrencyTradeDto: UpdateCurrencyTradeDto) {
    const cur = new CreateCurrencyTradeDto();
    cur.value = updateCurrencyTradeDto.value;
    return this.currencyTrade.update(id, { value: cur.value });
  }

  remove(id: number) {
    return `This action removes a #${id} currencyTrade`;
  }
  test() {
    this.log('test');
  }
  async setCurrencies({
    account,
    currencyTrades,
  }: {
    account: AccountEntity;
    currencyTrades: Currencies;
  }) {
    const currencyTradesUpdate: {
      id: number;
      data: UpdateCurrencyTradeDto;
    }[] = [];
    const currencyTradesCreate: CreateCurrencyTradeDto[] = [];

    const currencyTradesDB = (
      await this.currencyTrade.find({
        relations: ['account'],
      })
    ).filter((ct) => {
      return ct.account.brokerAccountId === account.brokerAccountId;
    });

    for (const curr of currencyTrades.currencies) {
      for (const crDB of currencyTradesDB) {
        if (curr.currency === crDB.name) {
          // Если уже есть такая валюта то обновляем его
          const param: { id: number; data: UpdateCurrencyTradeDto } = {
            id: crDB.id,
            data: {
              account,
              name: curr.currency,
              value: curr.balance,
              blocked: curr.blocked,
            },
          };
          currencyTradesUpdate.push(param);
        }
      }

      if (currencyTradesDB.length === 0) {
        // Создаем валюты если их нет совсем
        currencyTradesCreate.push({
          account,
          name: curr.currency,
          value: curr.balance,
          blocked: curr.blocked,
        });
      }
    }
    // this.warn(`update: ${currencyTradesUpdate.length}`);
    // this.warn(`create: ${currencyTradesCreate.length}`);

    for (const crUpdate of currencyTradesUpdate) {
      await this.update(crUpdate.id, crUpdate.data);
    }

    for (const crCreate of currencyTradesCreate) {
      await this.create(crCreate);
    }

    return true;
  }
}
