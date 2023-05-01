import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { ChangeAccountDto } from './dto/change-account.dto';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }
  @Delete()
  delete(@Body() deleteUserDto: DeleteUserDto) {
    return this.usersService.delete(deleteUserDto);
  }

  @Get(':idUser')
  async findOne(@Param('idUser') idUser) {
    return this.usersService.findUser(+idUser);
  }
  @Get('')
  async findAll() {
    return this.usersService.findAll();
  }
  @Post('fetch-accounts')
  async fetchAccounts() {
    return this.usersService.fetchAccounts();
  }
  @Post('account')
  async changeAccount(@Body() changeAccountDto: ChangeAccountDto) {
    return this.usersService.changeAccount(changeAccountDto);
  }
  @Get('account/:brokerAccountId')
  async findOneAccount(@Param('brokerAccountId') brokerAccountId) {
    return this.usersService.getAccountWithUser({
      brokerAccountId: brokerAccountId,
    });
  }
}
