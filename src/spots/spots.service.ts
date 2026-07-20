import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spot } from './spot.entity';
import { User } from '../users/user.entity';
import { CreateSpotDto, UpdateSpotDto } from './dto';

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

    const spot = this.spotRepo.create({ ...dto, user });
    return this.spotRepo.save(spot);
  }

  async getSpots(userId: number) {
    return this.spotRepo.find({ where: { user: { id: userId } } });
  }

  async updateSpot(userId: number, spotId: number, dto: UpdateSpotDto) {
    const spot = await this.spotRepo.findOne({ where: { id: spotId, user: { id: userId } } });
    if (!spot) throw new Error('Spot não encontrado');
    Object.assign(spot, dto);
    return this.spotRepo.save(spot);
  }

  async deleteSpot(userId: number, spotId: number) {
    const spot = await this.spotRepo.findOne({ where: { id: spotId, user: { id: userId } } });
    if (!spot) throw new Error('Spot não encontrado');
    return this.spotRepo.remove(spot);
  }
}
