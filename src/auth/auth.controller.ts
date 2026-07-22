import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { token, expiresIn } = await this.authService.login(body.email, body.password);
    
    const decoded = jwt.decode(token) as { exp: number };

    const expirationDate = new Date(decoded.exp * 1000);

    return { 
      access_token: token, 
      expiry_raw: expiresIn,
      expiry_timestamp: expirationDate.getTime(), 
      expiry_formatted_date: expirationDate.toLocaleString('pt-BR')
    };
  }
}