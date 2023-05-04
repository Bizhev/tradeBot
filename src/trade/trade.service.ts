import { Injectable } from '@nestjs/common';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { LogService } from '../services/Log.service';
import { UserService } from '../user/user.service';
import { ApiService } from '../api/api.service';
import { Trade } from './entities/trade.entity';
import { StrategyService } from '../strategy/strategy.service';
import { ToolService } from '../tool/tool.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  OrderOperationType,
  StrategyNameEnum,
  TradePortfolioFrom,
  TradeStatusEnum,
} from '../types/common';
import { Orderbook } from '@tinkoff/invest-openapi-js-sdk';
import { CurrencyTradeService } from '../currency-trade/currency-trade.service';
import { Currencies } from '@tinkoff/invest-openapi-js-sdk/build/domain';

@Injectable()
export class TradeService extends LogService {
  constructor(
    @InjectRepository(Trade)
    private readonly tradeRepository: Repository<Trade>,
    private readonly userService: UserService,
    private readonly apiService: ApiService,
    private readonly strategyService: StrategyService,
    private readonly toolService: ToolService,
    private readonly currencyTradeService: CurrencyTradeService,
  ) {
    super('Trade');
  }

  async create(createTradeDto: CreateTradeDto) {
    const trade = new Trade();

    trade.strategy = await this.strategyService.findOneByName(
      createTradeDto.strategy,
    );

    trade.account = await this.userService.getAccountByBrokerId({
      brokerAccountId: createTradeDto.brokerAccountId,
    });
    trade.tool = await this.toolService.getToolByFigi(createTradeDto.tool);

    trade.name = createTradeDto.name;
    trade.lots = createTradeDto.lots;
    trade.from = createTradeDto.from;
    trade.description = createTradeDto.description;
    trade.priceStartStrategy = createTradeDto.priceStartStrategy;
    trade.priceAverage = createTradeDto.priceAverage;
    trade.priceStarted = createTradeDto.priceStarted;
    trade.status = createTradeDto.status;
    trade.type = createTradeDto.type;
    trade.price = createTradeDto.price;
    trade.balance = createTradeDto.balance;
    trade.currency = createTradeDto.currency;
    try {
      await this.tradeRepository.save(trade);
      return true;
    } catch (err) {
      return false;
    }
  }

  async findAll() {
    // TODO:
    return this.portfolioCheck();
    // return `This action returns all trade`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trade`;
  }

  async findOneByParam({ brokerAccountId, figi, trades }) {
    for (const trade of trades) {
      if (
        trade.account.brokerAccountId === brokerAccountId &&
        trade.tool.figi === figi
      ) {
        this.warn(`${trade}`);
        return trade;
      }
    }

    return null;
  }

  async update(id: number, updateTradeDto: UpdateTradeDto) {
    const trade = new Trade();

    trade.strategy = await this.strategyService.findOneByName(
      updateTradeDto.strategy,
    );

    trade.name = updateTradeDto.name;
    trade.lots = updateTradeDto.lots;
    trade.description = updateTradeDto.description;
    trade.status = updateTradeDto.status;
    trade.priceAverage = updateTradeDto.priceAverage;
    trade.operation = updateTradeDto.operation;
    trade.price = updateTradeDto.price;
    trade.balance = updateTradeDto.balance;
    trade.currency = updateTradeDto.currency;
    try {
      await this.tradeRepository.update(id, trade);
      return true;
    } catch (err) {
      return false;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} trade`;
  }

  async portfolioCheck() {
    const accountsWithUser = await this.userService.getAccounts();
    try {
      for (const acc of accountsWithUser) {
        await this.userService.changeAccount({
          brokerAccountId: acc.brokerAccountId,
        });
        this.log(
          ` [[[${acc.user.name}]]] ${acc.brokerAccountId} ${acc.brokerAccountType}`,
        );

        const { positions } = await this.apiService.getPortfolio();

        const trades = (
          await this.tradeRepository.find({
            relations: ['account', 'tool'],
          })
        ).filter((tr) => {
          return tr.account.brokerAccountId === acc.brokerAccountId;
        });
        // return { trades, positions };

        //
        const tradesCreate: {
          type: string;
          data: CreateTradeDto;
        }[] = [];
        const tradesUpdate: {
          figi: string;
          id: number;
          data: UpdateTradeDto;
        }[] = [];

        for (const position of positions) {
          const price = +(
            position.averagePositionPrice.value +
            position.expectedYield.value / position.balance
          ).toFixed(2);

          // Собираем  данные для обновления
          for (const trade of trades) {
            if (position.ticker === trade.tool.ticker) {
              tradesUpdate.push({
                figi: position.figi,
                id: trade.id,
                data: {
                  name: position.name,
                  description:
                    trade.lots === position.lots
                      ? trade.description
                      : `${trade.description}. old:${trade.lots} new:${position.lots}`,
                  lots: position.lots,
                  priceAverage: position.averagePositionPrice.value,
                  price,
                  balance: position.balance,
                  currency: position.averagePositionPrice.currency,
                },
              });
            }
          }

          const [TU] = tradesUpdate.filter((tu) => {
            return tu.figi === position.figi;
          });
          // console.log({ TU });
          if (!TU) {
            // Если пусто то создаем новый
            tradesCreate.push({
              type: position.instrumentType,
              data: {
                strategy: StrategyNameEnum.Default,
                brokerAccountId: acc.brokerAccountId,
                tool: position.figi,
                name: position.name,
                lots: position.lots,
                from: TradePortfolioFrom.Portfolio,
                description: 'adding in portfolio',
                priceStartStrategy: 0,
                priceStarted: position.averagePositionPrice.value,
                priceAverage: position.averagePositionPrice.value,
                status: TradeStatusEnum.Process,
                type: position.instrumentType,
                price,
                balance: position.balance,
                currency: position.averagePositionPrice.currency,
              },
            });
          }
        }

        this.warn(
          `update: ${tradesUpdate.length} create: ${tradesCreate.length}`,
        );

        for (const TUpdate of tradesUpdate) {
          await this.update(TUpdate.id, TUpdate.data);
        }
        for (const TCreate of tradesCreate) {
          //FIXME
          // if (TCreate.type === 'Stock') await this.create(TCreate);
          if (TCreate.type === 'Stock') {
            await this.create(TCreate.data);
          }
          // if (TCreate.type === 'Bond') {
          //   await this.create(TCreate.data);
          // }
          // if (TCreate.type === 'Currency') {
          //   await this.create(TCreate.data);
          // }
        }
        /***
         * Проверка портфеля.
         * **/
        // this.log(`Завершил ${acc.brokerAccountId} ${acc.brokerAccountType}`);
      }
    } catch (err) {
      this.error(err.message);
    }
    // TODO: res parse

    return 'ok';
  }
  async test() {
    const [{ tool }] = await this.tradeRepository.find({ relations: ['tool'] });
    // const x = await this.apiService.limitOrder({
    //   figi: tool.figi,
    //   price: 950,
    //   operation: OrderOperationType.Buy,
    //   lots: 1,
    // });
    // const x = await this.apiService.cancelOrder({ orderId: '35792891788' });
    // const x = await this.apiService.orders();
    // const x = await this.apiService.portfolioCurrencies();

    const accounts = await this.userService.getAccounts();
    const x = [];
    for (const account of accounts) {
      await this.userService.changeAccount({
        brokerAccountId: account.brokerAccountId,
      });
      const p = await await this.apiService.getPortfolio();
      x.push(p);
    }
    // const x = await this.apiService.getPortfolio();
    return x;
  }
  async checkTrade() {
    const trades = (
      await this.tradeRepository.find({
        relations: ['tool', 'account', 'strategy'],
      })
    ).filter((tr) => {
      return tr.status === 1;
    });

    for (const trade of trades) {
      const book: Orderbook = await this.apiService.orderbookGet({
        figi: trade.tool.figi,
      });

      const [bid] = book.bids;
      const [ask] = book.asks;

      if (trade.operation === OrderOperationType.Buy) {
        // Позиции в лонг
        const str = trade.strategy;
        if (str.isActive) {
          // Если стратегия активна
          // console.log(
          //   trade.name,
          //   { str },
          //   ask.price,
          //   '=>',
          //   this.getPrice(ask.price, 0.5),
          // );
          const priceTake =
            trade.priceStartStrategy +
            +this.getPrice(
              trade.priceStartStrategy,
              trade.strategy.takeProfitPercent,
            );
          // console.log(trade.priceStartStrategy, ' -', { priceTake });
          if (trade.priceStartStrategy >= ask.price) {
            this.warn(`$ BUY:::: ${ask.price}`);
            // Цена ниже возможно купим
            // const order = await this.apiService.limitOrder({
            //   figi: trade.tool.figi,
            //   lots: 1,
            //   operation: 'Buy',
            //   price,
            // });
          } else {
            // Цена выше возможно закроем позицию

            if (trade.strategy.takeProfitPercent)
              this.warn(`SELL::: ${bid.price}`);
          }
        }
      } else if (trade.operation === OrderOperationType.Sell) {
        // Позиция в шорт
      }

      // const isChanged = await this.userService.changeAccount({
      //   brokerAccountId: trade.account.brokerAccountId,
      // });
    }
    return trades;
  }
  async сheckingPosition(trade: Trade, { asks, bids }: Orderbook) {
    // Стоит ли что то менять

    return { trade };
  }
  // Получение суммы по проценту
  getPrice(money, percent) {
    return ((money * percent) / 100).toFixed(2);
  }
  async updateCurrencyPortfolio() {
    // Обновляет у всех аккаунтов доступные валюты

    const accounts = await this.userService.getAccounts();

    try {
      for (const account of accounts) {
        await this.userService.changeAccount({
          brokerAccountId: account.brokerAccountId,
        });

        const currencies: Currencies =
          await this.apiService.portfolioCurrencies();

        // this.warn(`===> ${account.brokerAccountId}`);
        const res = await this.currencyTradeService.setCurrencies({
          account,
          currencyTrades: currencies,
        });
      }
    } catch (err) {
      this.error(err);
    }
  }
}
