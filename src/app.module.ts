import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDBOptions } from './configs/db.config';
import { UserModule } from './user/user.module';
import { ApiModule } from './api/api.module';
import { SettingModule } from './setting/setting.module';
import { ToolModule } from './tool/tool.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDBOptions,
    }),
    UserModule,
    SettingModule,
    ToolModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
