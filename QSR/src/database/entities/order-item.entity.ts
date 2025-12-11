import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { MenuItem } from './menu-item.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  // NEW: Instructions field added
  @Column({ nullable: true }) 
  instructions: string; 

  @Column('decimal', { precision: 10, scale: 2 })
  priceAtOrder: number;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @ManyToOne(() => MenuItem)
  menuItem: MenuItem;
}