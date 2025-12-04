import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    @Roles('admin')
    async getAll() {
        return this.usersService.getAll();
    }

    @Post()
    @Roles('admin')
    async create(@Body() body: any) {
        return this.usersService.createUser(body.username, body.password);
    }

    @Get(':id')
    @Roles('admin')
    async getOne(@Param('id') id: string) {
        return this.usersService.findById(+id);
    }
   
    @Put(':id')
    @Roles('admin')
    async update(
        @Param('id') id: string,
        @Body() body: any
    ) {
        return this.usersService.updateUser(+id, body);
    }

    @Delete(':id')
    @Roles('admin')
    async remove(@Param('id') id: string) {
        return this.usersService.deleteUser(+id);
    }
}