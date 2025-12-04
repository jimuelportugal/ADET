import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;

    const valid = await bcrypt.compare(pass, user.password);
    if (valid) {
      return {
        id: user.id,
        username: user.username,
        role: user.role,
      };
    }
    return null;
  }

  async login(user: { id: number; username: string; role: string }) {
    const payload = { sub: user.id, username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret',
      {
        // FIX: Cast to 'any' to resolve the overload mismatch
        expiresIn: (process.env.REFRESH_TOKEN_EXPIRE_IN || '7d') as any,
      },
    );

    await this.usersService.setRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const user = await this.usersService.findByRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.usersService.setRefreshToken(user.id, null);
    return { message: 'Logged out successfully' };
  }


  async refreshTokens(refreshToken: string) {
    try {
      const decoded: any = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret',
      );

      const user = await this.usersService.findById(decoded.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const stored = await this.usersService.findByRefreshToken(refreshToken);
      if (!stored) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload = {
        sub: user.id,
        username: user.username,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(payload);
      const newRefreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret',
        {
          expiresIn: (process.env.REFRESH_TOKEN_EXPIRE_IN || '5d') as any,
        },
      );

      await this.usersService.setRefreshToken(user.id, newRefreshToken);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (err) {
      throw new UnauthorizedException('Could not refresh token');
    }
  }
}