import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import UserEntity from './entities/user.entity';
import AccountEntity from './entities/account.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<string> {
    const user = new UserEntity();
    user.fio = createUserDto.fio;
    user.name = createUserDto.name;
    user.token = createUserDto.token;
    user.isActive = createUserDto.isActive;
    console.log(user);
    await this.userRepository.save(user);
    return 'ok';
  }
  async findUser(id): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      return user;
    }
    // return ;
  }
  async findAll() {
    return this.userRepository.find();
  }
  async update(data) {
    try {
      await this.userRepository.update(data.id, data);
      return 'ok';
    } catch (err) {
      console.error(err);
      return 'Error';
    }
  }
  async delete(id) {
    try {
      await this.userRepository.delete(id);
      return 'ok';
    } catch (err) {
      console.error(err);
      return 'Error';
    }
  }
}
