import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import dotenv from 'dotenv'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, 
    new FastifyAdapter({logger: true}));
  await app.listen( 3000, '0.0.0.0');
}
bootstrap();
