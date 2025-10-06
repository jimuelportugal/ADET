// Added a GET endpoint for the two new colum added: borrowed_book and borrow_status
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll() {
        return this.usersService.getAll();
    }

    @Post()
    async create(@Body() body: { username: string, password: string }) {
        return this.usersService.createUser(body.username, body.password);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id') id: string) {
        return this.usersService.findById(+id);
    }
   
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() body: { username?: string; password?: string; role?: string }
    ) {
        return this.usersService.updateUser(+id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.usersService.deleteUser(+id);
    }

    @Post('borrow/:id')
    async borrowBook(@Param('id') id: string, @Body('book') book: string) {
        return this.usersService.borrowBook(Number(id), book);
    }

    @Post('return/:id')
    async returnBook(@Param('id') id: string) {
        return this.usersService.returnBook(Number(id));
    }

    @Get('status/:id')
    async borrowStatus(@Param('id') id: string) {
        return this.usersService.getUserBorrowStatus(Number(id));
    }

}
