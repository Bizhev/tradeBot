import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TradeService } from './trade.service';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { ChangeAccountDto } from '../user/dto/change-account.dto';

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post()
  create(@Body() createTradeDto: CreateTradeDto) {
    return this.tradeService.create(createTradeDto);
  }
  @Get('/test')
  test() {
    return this.tradeService.test();
  }
  @Get('/check-trade')
  cheackTrade() {
    return this.tradeService.checkTrade();
  }
  @Post('/check-trade')
  cheackStrategy(@Body() { strategyName }) {
    return this.tradeService.checkTradeByStrategy(strategyName);
  }

  @Get('/update-currency-portfolio')
  updateCurrencyPortfolio() {
    return this.tradeService.updateCurrencyPortfolio();
  }

  @Get()
  findAll() {
    return this.tradeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tradeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTradeDto: UpdateTradeDto) {
    return this.tradeService.update(+id, updateTradeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tradeService.remove(+id);
  }
}
