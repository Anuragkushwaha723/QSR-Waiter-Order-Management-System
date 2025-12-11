import { IsInt, IsArray, ValidateNested, Min, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger'; // Swagger Decorator

class OrderItemDto {
  @ApiProperty()
  @IsInt()
  menuItemId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  instructions?: string; // NEW: Instructions allowed
}

export class CreateOrderDto {
  @ApiProperty()
  @IsInt()
  tableId: number;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}