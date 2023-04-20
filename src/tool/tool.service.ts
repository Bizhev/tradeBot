import { Injectable } from '@nestjs/common';
import { ApiService } from '../api/api.service';
import { InjectRepository } from '@nestjs/typeorm';
import CurrencyEntity from './entities/currency.entity';
import { Repository, UpdateResult } from 'typeorm';
import { sleep } from '../utils';
import { InstrumentType } from '@tinkoff/invest-openapi-js-sdk';
import StockEntity from './entities/stock.entity';
import EtfEntity from './entities/etf.entity';
import BondEntity from './entities/bond.entity';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { LogService } from '../services/Log.service';
import { TODO_ANY } from '../types/common';
import { SettingService } from '../setting/setting.service';
import SettingEntity from '../setting/entities/setting.entity';

@Injectable()
export class ToolService extends LogService {
  constructor(
    @InjectRepository(CurrencyEntity)
    private readonly currencyRepository: Repository<CurrencyEntity>,

    @InjectRepository(StockEntity)
    private readonly stockRepository: Repository<StockEntity>,

    @InjectRepository(EtfEntity)
    private readonly etfRepository: Repository<EtfEntity>,

    @InjectRepository(BondEntity)
    private readonly bondRepository: Repository<BondEntity>,

    private readonly settingService: SettingService,

    private readonly apiService: ApiService,
  ) {
    super('ToolService');
  }
  test() {
    return 'test';
    // return this.apiService.test();
  }
  // getTools
  async findTool(tool: string) {
    if (tool === 'test') {
      const t = 't';
      return t;
      // return await this.apiService.test();
    }
    if (tool === 'stocks') {
      await this.updateAll('Stock');
      const { instruments } = await this.apiService.fetchInstrumentsByType(
        'Stock',
      );
      return instruments;
    }
    if (tool === 'bonds') {
      await this.updateAll('Bond');
      const { instruments } = await this.apiService.fetchInstrumentsByType(
        'Bond',
      );
      return instruments;
    }
    if (tool === 'currencies') {
      const { instruments } = await this.apiService.fetchInstrumentsByType(
        'Currency',
      );
      await this.updateAll('Currency');
      // const c = new CurrencyEntity();
      // c.figi = instruments.figi;
      // c.minPriceIncrement = instruments
      // await this.currencyRepository.save(instruments);
      return instruments;
    }
    if (tool === 'etfs') {
      await this.updateAll('Etf');
      const { instruments } = await this.apiService.fetchInstrumentsByType(
        'Etf',
      );
      return instruments;
    }

    return { tool };
  }
  async create(createToolDto: CreateToolDto): Promise<boolean> {
    let result;
    const tool = this.getTool(createToolDto);

    try {
      if (createToolDto.type === 'Stock') {
        await this.stockRepository.save(tool as TODO_ANY);
      }

      if (createToolDto.type === 'Etf') {
        await this.etfRepository.save(tool as TODO_ANY);
      }
      if (createToolDto.type === 'Bond') {
        await this.bondRepository.save(tool as TODO_ANY);
      }
      if (createToolDto.type === 'Currency') {
        await this.currencyRepository.save(tool as TODO_ANY);
      }

      result = true;
    } catch (e) {
      this.error(e);
      result = false;
    }
    return result;
  }
  getTool(createToolDto: CreateToolDto) {
    if (createToolDto.type === 'Stock') {
      const tool = new StockEntity();
      tool.currency = createToolDto.currency;
      tool.type = createToolDto.type;
      tool.name = createToolDto.name;
      tool.lot = createToolDto.lot;
      tool.minPriceIncrement = createToolDto.minPriceIncrement;
      tool.isin = createToolDto.isin;
      tool.figi = createToolDto.figi;
      tool.country = '';
      tool.ticker = createToolDto.ticker;
      return tool;
    }

    if (createToolDto.type === 'Etf') {
      const tool = new EtfEntity();
      tool.currency = createToolDto.currency;
      tool.type = createToolDto.type;
      tool.name = createToolDto.name;
      tool.lot = createToolDto.lot;
      tool.minPriceIncrement = createToolDto.minPriceIncrement;
      tool.isin = createToolDto.isin;
      tool.figi = createToolDto.figi;
      // tool.country = '';
      tool.ticker = createToolDto.ticker;
      return tool;
    }
    if (createToolDto.type === 'Bond') {
      const tool = new BondEntity();
      tool.currency = createToolDto.currency;
      tool.type = createToolDto.type;
      tool.name = createToolDto.name;
      tool.lot = createToolDto.lot;
      tool.minPriceIncrement = createToolDto.minPriceIncrement;
      tool.isin = createToolDto.isin;
      tool.figi = createToolDto.figi;
      tool.ticker = createToolDto.ticker;
      tool.faceValue = createToolDto?.faceValue || 0;
      return tool;
    }
    if (createToolDto.type === 'Currency') {
      const tool = new CurrencyEntity();
      tool.currency = createToolDto.currency;
      tool.type = createToolDto.type;
      tool.name = createToolDto.name;
      tool.lot = createToolDto.lot;
      tool.minPriceIncrement = createToolDto.minPriceIncrement;
      tool.isin = createToolDto.isin;
      tool.figi = createToolDto.figi;
      tool.ticker = createToolDto.ticker;
      return tool;
    }
  }
  async getToolByTicker(ticker: CreateToolDto) {
    return await this.stockRepository.findOneBy({ ticker: ticker.ticker });
  }
  async update(
    id: number,
    updateToolDto: UpdateToolDto,
  ): Promise<UpdateResult> {
    if (updateToolDto.type === 'Stock') {
      return this.stockRepository.update(id, updateToolDto as TODO_ANY);
    }
    if (updateToolDto.type === 'Etf') {
      return this.etfRepository.update(id, updateToolDto);
    }
    if (updateToolDto.type === 'Bond') {
      return this.bondRepository.update(id, updateToolDto as TODO_ANY);
    }
    if (updateToolDto.type === 'Currency') {
      return this.currencyRepository.update(id, updateToolDto);
    }
  }
  // Обновляет, заполняет инструменты
  async updateAll(
    type: InstrumentType = 'Stock',
    COUNT_SLEEP_EVERY_SAVE_RECORD = 1000,
  ): Promise<boolean | any> {
    let isRefresh;
    // Новые инструменты
    const newTickers: string[] = [];
    // Удаленные инструменты
    const deletedTickers: string[] = [];
    const obj: any = {};
    try {
      const { instruments } = await this.apiService.fetchInstrumentsByType(
        type,
      );
      const localInstruments = await this.getLocalInstrumentsByType(type);
      /*
       * = 1 без изменений
       * = 2 новые
       * = 3 Удален, надо отметить в базе.
       * = 4 Помечен, что удален в базе, с ним ничего делать не надо
       * */
      localInstruments.forEach((lt) => {
        obj[lt.figi] = (lt.isDeleted && 4) || 3;
      });
      instruments.forEach((o) => {
        obj[o.figi] = (obj[o.figi] && 1) || 2;
      });

      for (const [key, value] of Object.entries(obj)) {
        switch (value) {
          case 1:
            break;
          case 4:
            break;
          case 2:
            newTickers.push(key);
            break;
          case 3:
            deletedTickers.push(key);
            break;
          default:
            // TODO: record to history DB
            this.error('**ERROR**');
        }
      }
      let count = 0;
      const pauseCount = 5;
      for (const n of newTickers) {
        if (pauseCount === count) {
          await sleep(COUNT_SLEEP_EVERY_SAVE_RECORD);
        }

        const tool = instruments.find((o) => o.figi === n);
        try {
          this.log(`Adding new: ${tool.type}: ${tool.ticker}`);
          tool.minPriceIncrement = tool.minPriceIncrement;
          tool.isin = tool.isin || '';
          tool.minQuantity = tool.minQuantity || 0;
          await this.create(tool);
        } catch (e) {
          this.error(e);
        }
        count += 1;
      }
      deletedTickers.forEach((n) => {
        // FIXME:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const tool = localInstruments.find((o) => o.figi === n);
        // Помечаем что они были удалены
        // TODO: Записывать в базу дату удаления
        this.update(tool.id, {
          ...tool,
          isDeleted: true,
        });
      });

      isRefresh = true;
    } catch (e) {
      this.error(e);
      isRefresh = false;
    }
    return { isRefresh, newTickers, deletedTickers };
  }
  async getLocalInstrumentsByType(type: InstrumentType) {
    if (type === 'Stock') {
      return await this.stockRepository.find();
    }
    if (type === 'Etf') {
      return await this.etfRepository.find();
    }
    if (type === 'Bond') {
      return await this.bondRepository.find();
    }
    if (type === 'Currency') {
      return await this.currencyRepository.find();
    }
  }
}
