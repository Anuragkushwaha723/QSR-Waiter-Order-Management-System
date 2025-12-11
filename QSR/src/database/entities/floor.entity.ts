import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Table } from './table.entity';

@Entity()
export class Floor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Table, (table) => table.floor)
  tables: Table[];
}