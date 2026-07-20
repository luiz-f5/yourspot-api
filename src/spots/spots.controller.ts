import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { SpotsService } from './spots.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSpotDto, UpdateSpotDto } from './dto';

@Controller('spots')
@UseGuards(JwtAuthGuard)
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Get()
  async findAll(@Req() req) {
    return this.spotsService.getSpots(req.user.id);
  }

  @Post()
  async create(@Req() req, @Body() dto: CreateSpotDto) {
    return this.spotsService.createSpot(req.user.id, dto);
  }

  @Put(':id')
  async update(@Req() req, @Param('id') id: number, @Body() dto: UpdateSpotDto) {
    return this.spotsService.updateSpot(req.user.id, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: number) {
    return this.spotsService.deleteSpot(req.user.id, id);
  }
}
