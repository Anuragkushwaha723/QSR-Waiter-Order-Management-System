import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { FloorTablesModule } from './modules/floor-tables/tables.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrdersModule } from './modules/orders/orders.module';

// Entities
import { Waiter } from './database/entities/waiter.entity';
import { Floor } from './database/entities/floor.entity';
import { Table } from './database/entities/table.entity';
import { Category } from './database/entities/category.entity';
import { MenuItem } from './database/entities/menu-item.entity';
import { Order } from './database/entities/order.entity';
import { OrderItem } from './database/entities/order-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    
    TypeOrmModule.forRoot({
      type: 'sqlite',        
      database: 'db.sqlite', 
      entities: [Waiter, Floor, Table, Category, MenuItem, Order, OrderItem],
      synchronize: true,  
    }),

    AuthModule,
    FloorTablesModule,
    MenuModule,
    OrdersModule,
  ],
})
export class AppModule {}