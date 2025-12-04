import { Controller, Get, UseGuards, Request, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { BooksService } from './books.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService) { }

    @UseGuards(JwtAuthGuard)
    @Get('borrowed')
    async getBorrowedBooks(@Request() req: any) {
        const userId = req.user.userId;
        return this.booksService.getBorrowedBooks(userId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @Roles('admin')
    async createBook(@Body() body: any) {
        return this.booksService.createBook(body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':bookId')
    @Roles('admin')
    async getBookById(@Param('bookId') bookId: string) {
        return this.booksService.findById(+bookId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':bookId')
    @Roles('admin')
    async updateBook(
        @Param('bookId') bookId: string,
        @Body() body: any
    ) {
        return this.booksService.updateBook(+bookId, body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':bookId')
    @Roles('admin')
    async deleteBook(@Param('bookId') bookId: string) {
        return this.booksService.deleteBook(+bookId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('reject/:bookId')
    @Roles('admin')
    async rejectBookRequest(@Param('bookId') bookId: string, @Body('reason') reason: string) {
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
    async requestBook(@Param('bookId') bookId: string, @Request() req: any) {
        const parsedBookId = Number(bookId);
        if (isNaN(parsedBookId)) {
            throw new BadRequestException('Invalid book ID format');
        }
        const userId = req.user.userId;
        return this.booksService.requestBook(parsedBookId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('cancel/:bookId')
    async cancelRequest(@Param('bookId') bookId: string, @Request() req: any) {
        const parsedBookId = Number(bookId);
        if (isNaN(parsedBookId)) {
            throw new BadRequestException('Invalid book ID format');
        }
        const userId = req.user.userId;
        return this.booksService.cancelRequest(parsedBookId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllBooks() {
        return this.booksService.getAllBooks();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('return/:bookId')
    @Roles('admin')
    async returnBook(@Param('bookId') bookId: string) {
        return this.booksService.returnBook(+bookId);
    }
}