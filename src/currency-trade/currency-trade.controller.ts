import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CurrencyTradeService } from './currency-trade.service';
import { CreateCurrencyTradeDto } from './dto/create-currency-trade.dto';
import { UpdateCurrencyTradeDto } from './dto/update-currency-trade.dto';

@Controller('currency-trade')
export class CurrencyTradeController {
  constructor(private readonly currencyTradeService: CurrencyTradeService) {}

  @Post()
  create(@Body() createCurrencyTradeDto: CreateCurrencyTradeDto) {
    return this.currencyTradeService.create(createCurrencyTradeDto);
  }

  @Get()
  findAll() {
    return this.currencyTradeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currencyTradeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCurrencyTradeDto: UpdateCurrencyTradeDto,
  ) {
    return this.currencyTradeService.update(+id, updateCurrencyTradeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.currencyTradeService.remove(+id);
  }
}
