import { Injectable } from '@nestjs/common';
import { CreateDividendDto } from './dto/create-dividend.dto';
import { UpdateDividendDto } from './dto/update-dividend.dto';

@Injectable()
export class DividendService {
  create(createDividendDto: CreateDividendDto) {
    return 'This action adds a new dividend';
  }

  findAll() {
    return `This action returns all dividend`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dividend`;
  }

  update(id: number, updateDividendDto: UpdateDividendDto) {
    return `This action updates a #${id} dividend`;
  }

  remove(id: number) {
    return `This action removes a #${id} dividend`;
  }
}
