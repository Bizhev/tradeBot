import { Injectable } from '@nestjs/common';
import { CreateStrategyDto } from './dto/create-strategy.dto';
import { UpdateStrategyDto } from './dto/update-strategy.dto';
import { Strategy } from './entities/strategy.entity';
import { StrategyNameEnum } from '../types/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogService } from '../services/Log.service';
import { defaultStrategy } from './constants/default.strategy';

@Injectable()
export class StrategyService extends LogService {
  constructor(
    @InjectRepository(Strategy)
    private readonly strategyRepository: Repository<Strategy>,
  ) {
    super('StrategyService');
    this.strategyRepository
      .findOneBy({ name: StrategyNameEnum.Default })
      .then((s) => {
        if (!s) {
          this.strategyRepository.save(defaultStrategy);
          this.log(`added default strategy`);
        }
      });
  }
  async create(createStrategyDto: CreateStrategyDto) {
    const strategy = new Strategy();
    strategy.name = createStrategyDto.name;
    strategy.useSaleStair = createStrategyDto.useSaleStair;
    strategy.stopLosePercent = createStrategyDto.stopLosePercent;
    strategy.saleFullPercent = createStrategyDto.saleFullPercent;
    strategy.isActive = createStrategyDto.isActive;
    strategy.notStopLosePercent = createStrategyDto.notStopLosePercent;
    strategy.priceLosePercentThenBuy =
      createStrategyDto.priceLosePercentThenBuy;
    strategy.profitStrategy = createStrategyDto.profitStrategy;
    strategy.profitStrategyCommission =
      createStrategyDto.profitStrategyCommission;
    strategy.takeProfitPercent = createStrategyDto.takeProfitPercent;

    try {
      await this.strategyRepository.save(strategy);
      this.log(`Saved new item: ${strategy.name}`);
      return 'ok';
    } catch (err) {
      return err.sqlMessage;
    }
  }

  findAll() {
    return `This action returns all strategy`;
  }

  findOne(id: number) {
    return this.strategyRepository.findOneBy({ id });
  }

  findOneByName(name: StrategyNameEnum) {
    return this.strategyRepository.findOneBy({ name });
  }

  update(id: number, updateStrategyDto: UpdateStrategyDto) {
    return `This action updates a #${id} strategy`;
  }

  remove(id: number) {
    return `This action removes a #${id} strategy`;
  }
}
