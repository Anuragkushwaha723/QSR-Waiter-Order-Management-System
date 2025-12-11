import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { TablesService } from './tables.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('tables')
@UseGuards(JwtAuthGuard)
export class TablesController {
  constructor(private tablesService: TablesService) {}

  @Get()
  findAll() {
    return this.tablesService.findAll();
  }

  @Post(':id/assign')
  assignSelf(@Param('id') id: string, @Request() req) {
    // req.user comes from JwtStrategy
    return this.tablesService.assignWaiter(+id, req.user.userId);
  }
}