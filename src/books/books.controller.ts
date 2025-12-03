import { Controller, Get, UseGuards, Request, Post, Param, BadRequestException } from '@nestjs/common';
import { BooksService } from './books.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService) {}

    @UseGuards(JwtAuthGuard)
    @Post('borrow/:bookId')
    async borrowBook(@Param('bookId') bookId: string, @Request() req: any) {
        const parsedBookId = Number(bookId);
        if (isNaN(parsedBookId)) {
            throw new BadRequestException('Invalid book ID format');
        }
        const userId = req.user.userId;
        return this.booksService.borrowBook(parsedBookId, userId);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('borrowed')
    async getBorrowedBooks(@Request() req: any) {
        const userId = req.user.userId;
        return this.booksService.getBorrowedBooks(userId);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllBooks() {
        return this.booksService.getAllBooks();
    }
}
