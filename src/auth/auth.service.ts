import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(email: string, password: string) {
    return this.usersService.create(email, password);
  }

  async login(email: string, password: string): Promise<{ token: string; expiresIn: string }> {
    const user = await this.usersService.validateUser(email, password);
    if (!user) throw new Error('Credenciais inválidas');

    const secret: jwt.Secret = process.env.AUTH_SECRET || 'fallbackSecret';
    const expiresIn: string = process.env.AUTH_EXPIRES_IN || '1h';

    const token = jwt.sign(
      { id: user.id, email: user.email },
      secret,
      { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] }
    );

    return { token, expiresIn };
  }
}
