import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spot } from './spot.entity';
import { SpotsService } from './spots.service';
import { SpotsController } from './spots.controller';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Spot, User])],
  providers: [SpotsService],
  controllers: [SpotsController],
})
export class SpotsModule {}
