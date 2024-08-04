import { Module } from '@nestjs/common';
import { databaseProviders } from './database.prividers';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
