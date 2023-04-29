import { Module } from '@nestjs/common';
import { ToolJobService } from './tool-job.service';

@Module({
  providers: [ToolJobService],
})
export class ToolJobModule {}
