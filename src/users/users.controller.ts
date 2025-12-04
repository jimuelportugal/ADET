import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private usersService) { }

    @Get()
    @Roles('admin')
    async getAll() {
        return this.usersService.getAll();
    }

    @Post()
    @Roles('admin')
    async create(@Body() body) {
        return this.usersService.createUser(body.username, body.password);
    }

    @Get(':id')
    @Roles('admin')
    async getOne(@Param('id') id) {
        return this.usersService.findById(+id);
    }
   
    @Put(':id')
    @Roles('admin')
    async update(
        @Param('id') id,
        @Body() body
    ) {
        return this.usersService.updateUser(+id, body);
    }

    @Delete(':id')
    @Roles('admin')
    async remove(@Param('id') id) {
        return this.usersService.deleteUser(+id);
    }
    
    @Post('borrow/:id')
    async borrowBook(@Param('id') id, @Body('book') book) {
        return this.usersService.borrowBook(Number(id), book);
    }

    @Post('return/:id')
    async returnBook(@Param('id') id) {
        return this.usersService.returnBook(Number(id));
    }

    @Get('status/:id')
    async borrowStatus(@Param('id') id) {
        return this.usersService.getUserBorrowStatus(Number(id));
    }
}
