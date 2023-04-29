import { Test, TestingModule } from '@nestjs/testing';
import { DividendController } from './dividend.controller';
import { DividendService } from './dividend.service';

describe('DividendController', () => {
  let controller: DividendController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DividendController],
      providers: [DividendService],
    }).compile();

    controller = module.get<DividendController>(DividendController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
