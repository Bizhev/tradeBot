import { ConfigService } from '@nestjs/config';
// import { User } from '../user/entities/user.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
// import { StockEntity } from '../tool/entities/stock.entity';
// import { Country } from '../country/entities/country.entity';
// import { Portfolio } from '../portfolio/entities/portfolio.entity';
import AccountEntity from '../user/entities/account.entity';
import UserEntity from '../user/entities/user.entity';
import CurrencyEntity from '../tool/entities/currency.entity';
import EtfEntity from '../tool/entities/etf.entity';
import BondEntity from '../tool/entities/bond.entity';
import StockEntity from '../tool/entities/stock.entity';
import SettingEntity from '../setting/entities/setting.entity';
import EventEntity from '../tool/entities/event.entity';
import { ReportEntity } from '../report/entities/report.entity';
import { Strategy } from '../strategy/entities/strategy.entity';
import { Trade } from '../trade/entities/trade.entity';
// import { Trade } from '../profile/entities/profile.entity';
// import { Profile } from '../profile/entities/profile.entity';

const entities = [
  UserEntity,
  AccountEntity,
  EtfEntity,
  BondEntity,
  StockEntity,
  CurrencyEntity,
  SettingEntity,
  EventEntity,
  ReportEntity,
  Strategy,
  Trade,
  // StockEntity,
  // Country,
  // Portfolio,
  // Profile,
];

export const getDBOptions = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: Number(configService.get('DB_PORT')),
  username: configService.get('DB_USERNANE'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities,
  synchronize: Boolean(configService.get('DB_SYNCHRONIZE')),
});
