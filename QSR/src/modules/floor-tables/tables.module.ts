import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { Table } from '../../database/entities/table.entity';
import { Waiter } from '../../database/entities/waiter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Table, Waiter])],
  controllers: [TablesController],
  providers: [TablesService],
})
export class FloorTablesModule {}