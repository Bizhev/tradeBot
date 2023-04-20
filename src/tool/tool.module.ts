import { Module } from '@nestjs/common';
import { ToolService } from './tool.service';
import { ToolController } from './tool.controller';
import { ApiModule } from '../api/api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import EtfEntity from './entities/etf.entity';
import CurrencyEntity from './entities/currency.entity';
import BondEntity from './entities/bond.entity';
import StockEntity from './entities/stock.entity';
import { SettingModule } from '../setting/setting.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CurrencyEntity,
      EtfEntity,
      BondEntity,
      StockEntity,
    ]),
    ApiModule,
    SettingModule,
  ],
  providers: [ToolService],
  controllers: [ToolController],
})
export class ToolModule {}
