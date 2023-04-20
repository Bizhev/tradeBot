import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import UserEntity from './entities/user.entity';
import AccountEntity from './entities/account.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiService } from '../api/api.service';
import { ChangeAccountDto } from './dto/change-account.dto';
import { IGetUser } from './interfaces/IGetUser.interface';
import { TODO_ANY } from '../types/common';
import { LogService } from '../services/Log.service';

@Injectable()
export class UserService extends LogService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,

    private readonly apiService: ApiService,
  ) {
    super('UserService');
    this.accountRepository
      .find()
      .then((accounts) => {
        const [account] = accounts;
        this.changeAccount({ brokerAccountId: account.brokerAccountId });
      })
      .catch((err) => {
        this.error(err);
      });
  }
  async create(createUserDto: CreateUserDto): Promise<string> {
    const user = new UserEntity();
    user.fio = createUserDto.fio;
    user.name = createUserDto.name;
    user.token = createUserDto.token;
    user.isActive = createUserDto.isActive;
    await this.userRepository.save(user);
    return 'ok';
  }

  /**
   * Получает пользователя по его ID
   * */
  async findUser(id): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      return user;
    }
  }
  async findAll() {
    return this.userRepository.find();
  }

  /**
   * Обновляет данные пользователя по его ID
   * */
  async update(data) {
    try {
      await this.userRepository.update(data.id, data);
      return 'ok';
    } catch (err) {
      console.error(err);
      return 'Error';
    }
  }
  /**
   * Удаляет пользователя по его ID
   * */
  async delete(id) {
    try {
      await this.userRepository.delete(id);
      return 'ok';
    } catch (err) {
      console.error(err);
      return 'Error';
    }
  }

  /**
   * Получение аккаунтов, если нет записывает в БД, если есть пропускает.
   * */
  async fetchAccounts() {
    const localAccounts = await this.accountRepository.find();
    const brokerAccountIds = localAccounts.map((acc) => acc.brokerAccountId);

    try {
      const users = await this.userRepository.find();
      // const [user] = users;
      for (const u of users) {
        await this.apiService.useTokenOnly(u.token);
        const accounts = await this.apiService.getAccounts();
        for (const acc of accounts) {
          if (!brokerAccountIds.includes(acc.brokerAccountId)) {
            // Если не существует с таким же brokerId то записываем в БД
            const account = new AccountEntity();
            account.user = u;
            account.brokerAccountId = acc.brokerAccountId;
            account.brokerAccountType = acc.brokerAccountType;
            await this.accountRepository.save(account);
          }
        }
      }
    } catch (error) {
      console.error(error);
      return { error };
    }
    return 'ok';
  }
  async changeAccount(changeAccountDto: ChangeAccountDto) {
    const accountWithUser: TODO_ANY = await this.getAccountWithUser({
      brokerAccountId: changeAccountDto.brokerAccountId,
    });

    return await this.apiService.setAccount({
      brokerAccountId: changeAccountDto.brokerAccountId,
      userId: accountWithUser.user.id,
      brokerAccountType: accountWithUser.brokerAccountType,
      token: accountWithUser.user.token,
    });
  }
  async getAccountWithUser({ token, brokerAccountId }: IGetUser) {
    if (token) {
      return await this.userRepository.findOneBy({ token });
    }
    if (brokerAccountId) {
      const accounts = await this.accountRepository.find({
        relations: ['user'],
      });
      const [accountWithUser] = accounts.filter(
        (acc) => acc.brokerAccountId === brokerAccountId,
      );
      return accountWithUser;
    }
  }
}
