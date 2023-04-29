import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDBOptions } from './configs/db.config';
import { UserModule } from './user/user.module';
import { ApiModule } from './api/api.module';
import { SettingModule } from './setting/setting.module';
import { ToolModule } from './tool/tool.module';
import { DividendModule } from './dividend/dividend.module';
import { ReportModule } from './report/report.module';
import { ToolJobModule } from './tool-job/tool-job.module';
import { TradeModule } from './trade/trade.module';
import { StrategyModule } from './strategy/strategy.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDBOptions,
    }),
    UserModule,
    SettingModule,
    ToolModule,
    DividendModule,
    ReportModule,
    ToolJobModule,
    TradeModule,
    StrategyModule,
    CompanyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
