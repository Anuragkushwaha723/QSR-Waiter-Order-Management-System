import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Table } from './table.entity';
import { Order } from './order.entity';

@Entity()
export class Waiter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string; // Hashed

  @Column()
  name: string;

  @OneToMany(() => Table, (table) => table.assignedWaiter)
  tables: Table[];

  @OneToMany(() => Order, (order) => order.waiter)
  orders: Order[];
}