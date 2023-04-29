import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DividendService } from './dividend.service';
import { CreateDividendDto } from './dto/create-dividend.dto';
import { UpdateDividendDto } from './dto/update-dividend.dto';

@Controller('dividend')
export class DividendController {
  constructor(private readonly dividendService: DividendService) {}

  @Post()
  create(@Body() createDividendDto: CreateDividendDto) {
    return this.dividendService.create(createDividendDto);
  }

  @Get()
  findAll() {
    return this.dividendService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dividendService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDividendDto: UpdateDividendDto,
  ) {
    return this.dividendService.update(+id, updateDividendDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dividendService.remove(+id);
  }
}
