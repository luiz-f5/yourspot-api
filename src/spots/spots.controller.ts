import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, Res, NotFoundException } from '@nestjs/common';
import { SpotsService } from './spots.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSpotDto, UpdateSpotDto } from './dto';
import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

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

  @Get(':id/image')
  async getImage(@Req() req, @Param('id') id: number) {
    const imagePath = await this.spotsService.getSpotImagePath(req.user.id, id);
    if (!imagePath) {
      throw new NotFoundException('Imagem não encontrada');
    }
  
    const fullPath = path.resolve('uploads', imagePath);
    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException('Arquivo não encontrado');
    }
  
    return fs.createReadStream(fullPath); // Fastify envia como stream
  }
}
