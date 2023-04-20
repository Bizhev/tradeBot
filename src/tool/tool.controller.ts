import { Controller, Get, Param } from '@nestjs/common';
import { ToolService } from './tool.service';

@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}
  @Get(':tool')
  async findStocks(@Param('tool') tool) {
    return await this.toolService.findTool(tool);
  }
}
