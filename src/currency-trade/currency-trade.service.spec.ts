import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyTradeService } from './currency-trade.service';

describe('CurrencyTradeService', () => {
  let service: CurrencyTradeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrencyTradeService],
    }).compile();

    service = module.get<CurrencyTradeService>(CurrencyTradeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
