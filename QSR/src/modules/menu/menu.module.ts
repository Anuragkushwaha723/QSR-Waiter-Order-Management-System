import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { Category } from '../../database/entities/category.entity';
import { MenuItem } from '../../database/entities/menu-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, MenuItem])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}