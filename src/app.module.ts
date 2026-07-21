import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SpotsModule } from './spots/spots.module';
import { ContactsModule } from './contacts/contacts.module';
import { readFileSync } from 'fs';
import getPass from './aws-sdk';

const pem = './global-bundle.pem'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
      const password = await getPass() 
          return {
            type: process.env.DB_TYPE as any, 
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '3306', 10),
            username: process.env.DB_USER,
            password: password,
            database: process.env.DB_NAME,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            dropSchema: false,
            ssl : true,
            extra: {
            ssl: {
              rejectUnauthorized: false,
              ca: readFileSync(pem),
        }
      },
            logging: 'all',
            logger: 'advanced-console',
          }
      }
    }
  ),
    AuthModule,
    UsersModule,
    SpotsModule,
    ContactsModule
  ],
})
export class AppModule {}
