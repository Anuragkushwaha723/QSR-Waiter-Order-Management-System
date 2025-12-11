import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Table } from '../../database/entities/table.entity';
import { MenuItem } from '../../database/entities/menu-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Table, MenuItem])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}