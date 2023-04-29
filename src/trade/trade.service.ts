import { Injectable } from '@nestjs/common';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { LogService } from '../services/Log.service';
import { UserService } from '../user/user.service';
import { ApiService } from '../api/api.service';

@Injectable()
export class TradeService extends LogService {
  constructor(
    private readonly userService: UserService,
    private readonly apiService: ApiService,
  ) {
    super('Trade');
  }

  create(createTradeDto: CreateTradeDto) {
    return 'This action adds a new trade';
  }

  async findAll() {
    // TODO:
    return this.portfolioCheck();
    // return `This action returns all trade`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trade`;
  }

  update(id: number, updateTradeDto: UpdateTradeDto) {
    return `This action updates a #${id} trade`;
  }

  remove(id: number) {
    return `This action removes a #${id} trade`;
  }

  async portfolioCheck() {
    const accountsWithUser = await this.userService.getAccounts();
    const accounts = accountsWithUser.map((a) => {
      return {
        id: a.id,
        brokerAccountType: a.brokerAccountType,
        brokerAccountId: a.brokerAccountId,
        fio: a.user.fio,
        name: a.user.name,
        token: a.user.token,
        isActive: a.user.isActive,
        cash: a.user.cash,
        created_at: a.created_at,
        updated_at: a.updated_at,
      };
    });
    const res = [];
    try {
      for (const acc of accounts) {
        this.log(
          `Начал ${acc.name} ${acc.brokerAccountId} ${acc.brokerAccountType}`,
        );
        await this.apiService.setAccount({
          brokerAccountId: acc.brokerAccountId,
          token: acc.token,
          brokerAccountType: acc.brokerAccountType,
        });
        const port = await this.apiService.getPortfolio();

        res.push({ name: acc.name, ...port });
        /***
         * Проверка портфеля.
         * **/
        this.log(`Завершил ${acc.brokerAccountId} ${acc.brokerAccountType}`);
      }
    } catch (err) {
      this.error(err.message);
    }

    return res;
  }
}
