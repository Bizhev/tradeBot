import { Injectable } from '@nestjs/common';
import SettingEntity from './entities/setting.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TODO_ANY } from '../types/common';
import { SetSettingDto } from './dto/set-setting.dto';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(SettingEntity)
    private readonly settingRepository: Repository<SettingEntity>,
  ) {}
  async getSetting(key: string): Promise<string> {
    const setting = await this.settingRepository.findOneBy({
      key: String(key),
    });
    return setting?.value || '';
  }
  async setSetting(key: string, value: string) {
    const setting = await this.settingRepository.findOneBy({
      key: String(key),
    });
    if (setting) {
      await this.settingRepository.update(+setting.id, {
        key: String(key),
        value,
      });
    } else {
      await this.settingRepository.save({ key: String(key), value });
    }
  }
}
