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
import { StrategyNameEnum, TradeStatusEnum } from '../types/common';

@Injectable()
export class TradeService extends LogService {
  constructor(
    @InjectRepository(Trade)
    private readonly tradeRepository: Repository<Trade>,
    private readonly userService: UserService,
    private readonly apiService: ApiService,
    private readonly strategyService: StrategyService,
    private readonly toolService: ToolService,
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

  update(id: number, updateTradeDto: UpdateTradeDto) {
    return `This action updates a #${id} trade`;
  }

  remove(id: number) {
    return `This action removes a #${id} trade`;
  }

  async portfolioCheck() {
    const accountsWithUser = await this.userService.getAccounts();
    const accounts = accountsWithUser.map((a) => {
      return {
        id: a.id,
        brokerAccountType: a.brokerAccountType,
        brokerAccountId: a.brokerAccountId,
        fio: a.user.fio,
        name: a.user.name,
        token: a.user.token,
        isActive: a.user.isActive,
        cash: a.user.cash,
        created_at: a.created_at,
        updated_at: a.updated_at,
      };
    });
    const res = [];
    try {
      for (const acc of accounts) {
        // this.log(
        //   `Начал ${acc.name} ${acc.brokerAccountId} ${acc.brokerAccountType}`,
        // );
        await this.apiService.setAccount({
          brokerAccountId: acc.brokerAccountId,
          token: acc.token,
          brokerAccountType: acc.brokerAccountType,
        });
        const { positions } = await this.apiService.getPortfolio();

        res.push({
          brokerAccountId: acc.brokerAccountId,
          positions,
        });
        if (positions.length > 0) {
          // If then positions
          for (const pos of positions) {
            // FIXME:
            await this.create({
              strategy: StrategyNameEnum.Default,
              brokerAccountId: acc.brokerAccountId,
              tool: pos.figi,
              name: pos.name,
              description: 'added auto portfolio update',
              priceStartStrategy: 0,
              lots: pos.lots,
              status: TradeStatusEnum.End,
              priceAverage: pos.averagePositionPrice.value,
              priceStarted: pos.averagePositionPrice.value,
            });
            const tool = await this.toolService.getToolByFigi(pos.figi);
          }
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

    return res;
  }
}
