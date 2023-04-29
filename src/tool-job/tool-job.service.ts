import { Injectable } from '@nestjs/common';
import { LogService } from '../services/Log.service';

@Injectable()
export class ToolJobService extends LogService {
  constructor() {
    super('ToolJob');
  }
}
