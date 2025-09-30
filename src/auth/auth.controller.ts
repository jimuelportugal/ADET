import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

    @Post('register')
    async register(@Body() body: { username: string; password: string }) {
        return this.usersService.createUser(body.username, body.password);
    }

    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        const user = await this.authService.validateUser(body.username, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Ensure the object matches the expected type for login()
        return this.authService.login({
            id: user.id,
            username: user.username,
            role: user.role, 
        });
    }

    // ✅ Removed logout() to avoid TS error since authService.logout() doesn't exist

    @Post('refresh')
    async refresh(@Body() body: { refreshToken: string }) {
        return this.authService.refreshTokens(body.refreshToken);
    }
}
