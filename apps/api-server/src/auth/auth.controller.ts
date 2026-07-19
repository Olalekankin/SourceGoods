import { Controller, Post, Get, Body, Req, HttpCode, HttpStatus, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterBody, RegisterResponse, LoginBody, LoginResponse, GetMeResponse } from '@workspace/api-zod';
import { Request } from 'express';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/register')
  async register(@Body() body: any) {
    const parsed = RegisterBody.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.message);
    }
    const result = await this.authService.register(parsed.data);
    return RegisterResponse.parse(result);
  }

  @Post('auth/login')
  async login(@Body() body: any) {
    const parsed = LoginBody.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.message);
    }
    const result = await this.authService.login(parsed.data);
    return LoginResponse.parse(result);
  }

  @Post('auth/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Req() req: Request) {
    const auth = req.headers.authorization;
    if (auth?.startsWith("Bearer ")) {
      this.authService.logout(auth.slice(7));
    }
  }

  @Get('auth/me')
  async getMe(@Req() req: Request) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Unauthorized");
    }
    const token = auth.slice(7);
    const result = await this.authService.getMe(token);
    return GetMeResponse.parse(result);
  }
}
