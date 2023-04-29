import { Test, TestingModule } from '@nestjs/testing';
import { ToolJobService } from './tool-job.service';

describe('ToolJobService', () => {
  let service: ToolJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToolJobService],
    }).compile();

    service = module.get<ToolJobService>(ToolJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
