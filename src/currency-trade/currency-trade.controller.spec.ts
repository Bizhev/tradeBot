import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyTradeController } from './currency-trade.controller';
import { CurrencyTradeService } from './currency-trade.service';

describe('CurrencyTradeController', () => {
  let controller: CurrencyTradeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyTradeController],
      providers: [CurrencyTradeService],
    }).compile();

    controller = module.get<CurrencyTradeController>(CurrencyTradeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
