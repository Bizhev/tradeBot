import { Injectable } from '@nestjs/common';
import { Setting } from './entities/setting.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TODO_ANY } from '../types/common';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private readonly _settingRepository: Repository<Setting>,
  ) {}
  async getSetting(key: TODO_ANY) {
    // @ts-ignore
    const [setting] = await this._settingRepository.find({ key });
    return setting?.value || '';
  }
  async setSetting(key: TODO_ANY, value: string) {
    // @ts-ignore
    const [setting] = await this._settingRepository.find({ key });
    if (setting) {
      await this._settingRepository.update(+setting.id, { key, value });
    } else {
      await this._settingRepository.save({ key, value });
    }
  }
}
