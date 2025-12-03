import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { BooksService } from './books.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService) {}

    // GET /books/borrowed
    // This is the specific endpoint the frontend ProfilePage calls.
    @UseGuards(JwtAuthGuard)
    @Get('borrowed')
    async getBorrowedBooks(@Request() req: any) {
        // The userId is securely extracted from the JWT payload by the JwtAuthGuard
        const userId = req.user.userId;
        
        // Fetches books only for the authenticated user
        return this.booksService.getBorrowedBooks(userId);
    }
    
    // GET /books 
    // This endpoint is likely for the main dashboard view to see all available and borrowed books
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllBooks() {
        return this.booksService.getAllBooks();
    }
}
