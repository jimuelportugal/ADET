import { Controller, Get, UseGuards, Request, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { BooksService } from './books.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('books')
export class BooksController {
    constructor(private booksService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @Roles('admin')
    async createBook(@Body() body) {
        return this.booksService.createBook(body);
    }
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':bookId')
    @Roles('admin')
    async getBookById(@Param('bookId') bookId) {
        return this.booksService.findById(+bookId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':bookId')
    @Roles('admin')
    async updateBook(
        @Param('bookId') bookId,
        @Body() body
    ) {
        return this.booksService.updateBook(+bookId, body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':bookId')
    @Roles('admin')
    async deleteBook(@Param('bookId') bookId) {
        return this.booksService.deleteBook(+bookId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('reject/:bookId')
    @Roles('admin')
    async rejectBookRequest(@Param('bookId') bookId, @Body('reason') reason) {
        const parsedBookId = Number(bookId);
        if (isNaN(parsedBookId)) {
            throw new BadRequestException('Invalid book ID format');
        }
        if (!reason || typeof reason !== 'string') {
             throw new BadRequestException('Rejection reason is required.');
        }
        return this.booksService.rejectRequest(parsedBookId, reason);
    }

    @UseGuards(JwtAuthGuard)
    @Post('request/:bookId')
    async requestBook(@Param('bookId') bookId, @Request() req) {
        const parsedBookId = Number(bookId);
        if (isNaN(parsedBookId)) {
            throw new BadRequestException('Invalid book ID format');
        }
        const userId = req.user.userId;
        return this.booksService.requestBook(parsedBookId, userId);
    }
    
    @UseGuards(JwtAuthGuard)
    @Post('cancel/:bookId')
    async cancelRequest(@Param('bookId') bookId, @Request() req) {
        const parsedBookId = Number(bookId);
        if (isNaN(parsedBookId)) {
            throw new BadRequestException('Invalid book ID format');
        }
        const userId = req.user.userId;
        return this.booksService.cancelRequest(parsedBookId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('borrowed')
    async getBorrowedBooks(@Request() req) {
        const userId = req.user.userId;
        return this.booksService.getBorrowedBooks(userId);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllBooks() {
        return this.booksService.getAllBooks();
    }
}
