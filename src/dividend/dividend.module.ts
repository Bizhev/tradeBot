import { Module } from '@nestjs/common';
import { DividendService } from './dividend.service';
import { DividendController } from './dividend.controller';

@Module({
  controllers: [DividendController],
  providers: [DividendService],
})
export class DividendModule {}
