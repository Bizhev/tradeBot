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
  TODO_ANY,
  TradeStatusEnum,
} from '../types/common';
import {
  Orderbook,
  Portfolio,
  PortfolioCurrenciesResponse,
} from '@tinkoff/invest-openapi-js-sdk';
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

    trade.status = createTradeDto.status;
    trade.name = createTradeDto.name;
    trade.lots = createTradeDto.lots;
    trade.description = createTradeDto.description;
    trade.priceStartStrategy = createTradeDto.priceStartStrategy;
    trade.priceAverage = createTradeDto.priceAverage;
    trade.priceStarted = createTradeDto.priceStarted;
    trade.type = createTradeDto.type;

    if (!trade.tool) {
      this.warn(`Need first update this tool: ${trade.name}`);
      // TODO: need update tool
    } else {
      await this.tradeRepository.save(trade);
    }

    return trade;
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

  update(id: number, updateTradeDto: UpdateTradeDto) {
    return `This action updates a #${id} trade`;
  }

  remove(id: number) {
    return `This action removes a #${id} trade`;
  }

  async portfolioCheck() {
    const accountsWithUser = await this.userService.getAccounts();
    try {
      for (const acc of accountsWithUser) {
        // await this.userService.changeAccount({
        //   brokerAccountId: acc.brokerAccountId,
        // });
        await this.apiService.setAccount({
          brokerAccountId: acc.brokerAccountId,
          token: acc.user.token,
          brokerAccountType: acc.brokerAccountType,
        });
        this.log(
          ` [[[${acc.user.name}]]] ${acc.brokerAccountId} ${acc.brokerAccountType}`,
        );

        const { positions } = await this.apiService.getPortfolio();
        const trades = await this.tradeRepository.find({
          relations: ['account', 'tool'],
        });

        if (positions.length > 0) {
          // If then positions
          for (const pos of positions) {
            const [trade] = trades.filter((tr) => {
              return (
                tr.account.brokerAccountId === acc.brokerAccountId &&
                tr.tool.figi === pos.figi
              );
            });

            if (!trade) {
              if (pos.instrumentType === 'Stock') {
                // FIXME: Deletet this type, need all type
                this.log(
                  `Adding new trade: ${acc.user.name} with ${pos.name} ${trade} ${acc.brokerAccountId} ${pos.figi}`,
                );

                await this.create({
                  strategy: StrategyNameEnum.Default,
                  brokerAccountId: acc.brokerAccountId,
                  tool: pos.figi,
                  name: pos.name,
                  description: 'added auto portfolio update',
                  priceStartStrategy: 0,
                  lots: pos.lots,
                  status: TradeStatusEnum.End,
                  type: pos.instrumentType,
                  priceAverage: pos.averagePositionPrice.value,
                  priceStarted: pos.averagePositionPrice.value,
                });
              } else if (pos.instrumentType === 'Bond') {
                // this.warn(`${pos.name}, ${pos.lots}, ${acc.name}`);
              } else if (pos.instrumentType === 'Currency') {
                // this.warn(`${pos.name}, ${pos.lots}, ${acc.name}`);
              } else if (pos.instrumentType === 'Etf') {
                // this.warn(`${pos.name}, ${pos.lots}, ${acc.name}`);
              }
            } else {
              // TODO NEED UPDATE ME
              this.warn(`UPDATE MAYBE::: ${acc.user.name}`);
            }
            // const tool = await this.toolService.getToolByFigi(pos.figi);
          }
        }
        this.log(`ok`);
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
    const x = await this.apiService.portfolioCurrencies();
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
