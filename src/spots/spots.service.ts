import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spot } from './spot.entity';
import { User } from '../users/user.entity';
import { CreateSpotDto, UpdateSpotDto } from './dto';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SpotsService {
  constructor(
    @InjectRepository(Spot) private spotRepo: Repository<Spot>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async createSpot(userId: number, dto: CreateSpotDto) {
    const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: { spots: true },
      });
    if (!user) throw new Error('Usuário não encontrado');

    if (user.spots.length >= 50) {
      throw new Error('Limite de 50 spots atingido');
    }

    let imagePath: string | undefined;
    if (dto.imageBase64) {
      const buffer = Buffer.from(dto.imageBase64, 'base64');
      const filename = `${uuid()}.jpg`;
      const uploadDir = path.resolve('uploads');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fullPath = path.join(uploadDir, filename);
      fs.writeFileSync(fullPath, buffer);
      imagePath = filename;
    }

    const spot = this.spotRepo.create({
      title: dto.title,
      description: dto.description,
      latitude: dto.latitude,
      longitude: dto.longitude,
      location: dto.location,
      imagePath,
      user,
    });

    return this.spotRepo.save(spot);
  }

  async getSpots(userId: number) {
    return this.spotRepo.find({ where: { user: { id: userId } } });
  }

  async updateSpot(userId: number, spotId: number, dto: UpdateSpotDto) {
    const spot = await this.spotRepo.findOne({ where: { id: spotId, user: { id: userId } } });
    if (!spot) throw new Error('Spot não encontrado');

    if (dto.imageBase64) {
      const buffer = Buffer.from(dto.imageBase64, 'base64');
      const filename = `${uuid()}.jpg`;
      const uploadDir = path.resolve('uploads');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fullPath = path.join(uploadDir, filename);
      fs.writeFileSync(fullPath, buffer);
      spot.imagePath = filename;
    }

    Object.assign(spot, {
      title: dto.title ?? spot.title,
      description: dto.description ?? spot.description,
      latitude: dto.latitude ?? spot.latitude,
      longitude: dto.longitude ?? spot.longitude,
      location: dto.location ?? spot.location,
    });

    return this.spotRepo.save(spot);
  }

  async deleteSpot(userId: number, spotId: number) {
    const spot = await this.spotRepo.findOne({ where: { id: spotId, user: { id: userId } } });
    if (!spot) throw new Error('Spot não encontrado');
    
    if (spot.imagePath) {
      const fullPath = path.resolve('uploads', spot.imagePath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (err) {
          console.error('Erro ao deletar imagem:', err);
        }
      }
    }
  
    return this.spotRepo.remove(spot);
  }

  async getSpotImagePath(userId: number, spotId: number): Promise<string | null> {
    const spot = await this.spotRepo.findOne({ where: { id: spotId, user: { id: userId } } });
    if (!spot || !spot.imagePath) return null;
    return spot.imagePath;
  }
}
