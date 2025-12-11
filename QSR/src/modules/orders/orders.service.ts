import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Table } from '../../database/entities/table.entity';
import { MenuItem } from '../../database/entities/menu-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    private dataSource: DataSource,
  ) {}

  // 1. Create Order (Updated with Instructions)
  async create(createOrderDto: CreateOrderDto, waiterId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const table = await queryRunner.manager.findOne(Table, {
        where: { id: createOrderDto.tableId },
        relations: ['assignedWaiter'],
      });

      if (!table) throw new NotFoundException('Table not found');
      if (table.assignedWaiter?.id !== waiterId) {
        throw new BadRequestException('You are not assigned to this table');
      }

      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      for (const itemDto of createOrderDto.items) {
        const menuItem = await queryRunner.manager.findOne(MenuItem, {
          where: { id: itemDto.menuItemId },
        });

        if (!menuItem || !menuItem.isAvailable) 
          throw new BadRequestException(`Item ${itemDto.menuItemId} unavailable`);
        
        const orderItem = new OrderItem();
        orderItem.menuItem = menuItem;
        orderItem.quantity = itemDto.quantity;
        orderItem.priceAtOrder = menuItem.price;
        orderItem.instructions = itemDto.instructions; // SAVING INSTRUCTIONS
        
        totalAmount += Number(menuItem.price) * itemDto.quantity;
        orderItems.push(orderItem);
      }

      const order = new Order();
      order.orderNumber = uuidv4().slice(0, 8).toUpperCase();
      order.table = table;
      order.waiter = table.assignedWaiter;
      order.status = OrderStatus.PENDING;
      order.totalAmount = totalAmount;
      order.items = orderItems;

      const savedOrder = await queryRunner.manager.save(Order, order);
      await queryRunner.commitTransaction();
      return savedOrder;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 2. NEW: Get Table History
  async getTableHistory(tableId: number) {
    return this.orderRepo.find({
      where: { table: { id: tableId } },
      relations: ['items', 'items.menuItem'],
      order: { createdAt: 'DESC' }
    });
  }

  // 3. NEW: Update Status
  async updateStatus(orderId: number, status: OrderStatus) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    
    // Simple state validation logic can go here
    order.status = status;
    return this.orderRepo.save(order);
  }
}