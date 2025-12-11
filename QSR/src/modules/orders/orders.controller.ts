import { Controller, Post, Get, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrderStatus } from '../../database/entities/order.entity';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(createOrderDto, req.user.userId);
  }

  // NEW: Get history for a specific table
  @Get('table/:id')
  getTableHistory(@Param('id') id: string) {
    return this.ordersService.getTableHistory(+id);
  }

  // NEW: Update Order Status
  @Patch(':id/status')
  @ApiBody({ schema: { example: { status: 'COOKING' } } })
  updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateStatus(+id, status);
  }
}