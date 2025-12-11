import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table, TableStatus } from '../../database/entities/table.entity';
import { Waiter } from '../../database/entities/waiter.entity';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table) private tableRepo: Repository<Table>,
    @InjectRepository(Waiter) private waiterRepo: Repository<Waiter>,
  ) {}

  async findAll() {
    return this.tableRepo.find({ relations: ['floor', 'assignedWaiter'] });
  }

  async assignWaiter(tableId: number, waiterId: number) {
    const table = await this.tableRepo.findOne({ 
        where: { id: tableId },
        relations: ['assignedWaiter']
    });
    if (!table) throw new NotFoundException('Table not found');

    // Business Logic: One waiter per table
    if (table.assignedWaiter && table.assignedWaiter.id !== waiterId) {
       // Optional: Allow override or throw error
       throw new BadRequestException('Table already assigned to another waiter');
    }

    const waiter = await this.waiterRepo.findOne({ where: { id: waiterId } });
    if (!waiter) throw new NotFoundException('Waiter not found');

    table.assignedWaiter = waiter;
    table.status = TableStatus.OCCUPIED;
    return this.tableRepo.save(table);
  }
}