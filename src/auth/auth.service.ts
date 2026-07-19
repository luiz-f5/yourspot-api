import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(email: string, password: string) {
    return this.usersService.create(email, password);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.usersService.validateUser(email, password);
    if (!user) throw new Error('Credenciais inválidas');

    const secret = process.env.AUTH_SECRET || 'fallbackSecret';
    return jwt.sign({ email }, secret, { expiresIn: '1h' });
  }
}
