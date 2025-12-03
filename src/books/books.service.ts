import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class BooksService {
    constructor(private db: DatabaseService) {}

    private pool = () => this.db.getPool();

    async borrowBook(bookId: number, userId: number) {
        const [bookRows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT book_id, status FROM books WHERE book_id = ?`,
            [bookId]
        );
        const book = bookRows[0];

        if (!book) {
            throw new NotFoundException('Book not found');
        }
        if (book.status !== 'available') {
            throw new BadRequestException('Book is already borrowed');
        }
        
        const [userBook] = await this.pool().execute<RowDataPacket[]>(
             `SELECT book_id FROM books WHERE borrower_id = ? AND status = 'borrowed'`,
             [userId]
        );

        if (userBook.length > 0) {
            throw new BadRequestException('You must return your current book before borrowing a new one.');
        }

        const [result] = await this.pool().execute<OkPacket>(
            `UPDATE books SET borrower_id = ?, status = 'borrowed' WHERE book_id = ?`,
            [userId, bookId]
        );

        return { success: result.affectedRows > 0, bookId, userId };
    }

    async getBorrowedBooks(userId: number) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT book_id, title, image_link, status, created_at, updated_at
             FROM books
             WHERE borrower_id = ? AND status = 'borrowed'`,
            [userId],
        );
        return rows;
    }
    
    async getAllBooks() {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT book_id, title, image_link, borrower_id, status, created_at, updated_at 
             FROM books`
        );
        return rows;
    }
}
