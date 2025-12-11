import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import { Waiter } from '../entities/waiter.entity';
import { Floor } from '../entities/floor.entity';
import { Table } from '../entities/table.entity';
import { Category } from '../entities/category.entity';
import { MenuItem } from '../entities/menu-item.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  console.log('Seeding database...');

  // 1. Seed Waiters
  const waiterRepo = dataSource.getRepository(Waiter);
  const password = await bcrypt.hash('password123', 10);
  
  await waiterRepo.save([
    { username: 'waiter1', password, name: 'John Doe' },
    { username: 'waiter2', password, name: 'Jane Smith' },
    { username: 'waiter3', password, name: 'Bob Wilson' },
  ]);

  // 2. Seed Floors & Tables
  const floorRepo = dataSource.getRepository(Floor);
  const tableRepo = dataSource.getRepository(Table);

  const floor1 = await floorRepo.save({ name: 'Ground Floor' });
  const floor2 = await floorRepo.save({ name: 'Rooftop' });

  await tableRepo.save([
    { number: 'T1', capacity: 4, floor: floor1 },
    { number: 'T2', capacity: 2, floor: floor1 },
    { number: 'T3', capacity: 6, floor: floor1 },
    { number: 'R1', capacity: 4, floor: floor2 },
    { number: 'R2', capacity: 2, floor: floor2 },
  ]);

  // 3. Seed Menu
  const catRepo = dataSource.getRepository(Category);
  const itemRepo = dataSource.getRepository(MenuItem);

  const starters = await catRepo.save({ name: 'Starters' });
  const mains = await catRepo.save({ name: 'Mains' });
  const drinks = await catRepo.save({ name: 'Drinks' });

  await itemRepo.save([
    { name: 'Fries', price: 5.99, category: starters },
    { name: 'Wings', price: 8.99, category: starters },
    { name: 'Burger', price: 12.99, category: mains },
    { name: 'Pizza', price: 14.99, category: mains },
    { name: 'Coke', price: 2.99, category: drinks },
  ]);

  console.log('Seeding complete!');
  await app.close();
}
bootstrap();