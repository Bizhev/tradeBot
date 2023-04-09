import { ConfigService } from '@nestjs/config';
// import { User } from '../user/entities/user.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
// import { StockEntity } from '../tool/entities/stock.entity';
// import { Country } from '../country/entities/country.entity';
// import { Portfolio } from '../portfolio/entities/portfolio.entity';
import AccountEntity from '../user/entities/account.entity';
import UserEntity from '../user/entities/user.entity';
// import { Profile } from '../profile/entities/profile.entity';
// import { CurrencyEntity } from '../tool/entities/currency.entity';

const entities = [
  UserEntity,
  AccountEntity,
  // StockEntity,
  // Country,
  // Portfolio,
  // Profile,
  // CurrencyEntity,
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
