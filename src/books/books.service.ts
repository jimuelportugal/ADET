import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class BooksService {
    constructor(private db: DatabaseService) {}

    private pool = () => this.db.getPool();

    /**
     * Retrieves all books currently marked as 'borrowed' by a specific user.
     * This is the method used for the user's "Profile" view.
     */
    async getBorrowedBooks(userId: number) {
        // Query to select books where the borrower_id matches the authenticated userId
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT book_id, title, image_link, status, created_at, updated_at
             FROM books
             WHERE borrower_id = ? AND status = 'borrowed'`,
            [userId],
        );
        return rows;
    }
    
    /**
     * Retrieves all books, regardless of status or borrower (for the main dashboard).
     */
    async getAllBooks() {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT book_id, title, image_link, borrower_id, status, created_at, updated_at 
             FROM books`
        );
        return rows;
    }
}
