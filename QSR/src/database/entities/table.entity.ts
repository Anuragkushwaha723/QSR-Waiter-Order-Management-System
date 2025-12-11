import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Floor } from './floor.entity';
import { Waiter } from './waiter.entity';
import { Order } from './order.entity';

export enum TableStatus {
  VACANT = 'VACANT',
  OCCUPIED = 'OCCUPIED',
}

@Entity()
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @Column()
  capacity: number;

  @Column({ type: 'simple-enum', enum: TableStatus, default: TableStatus.VACANT })
  status: TableStatus;

  @ManyToOne(() => Floor, (floor) => floor.tables)
  floor: Floor;

  @ManyToOne(() => Waiter, (waiter) => waiter.tables, { nullable: true })
  assignedWaiter: Waiter;

  @OneToMany(() => Order, (order) => order.table)
  orders: Order[];
}