import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class BooksService {
    constructor(private db) {}

    private pool = () => this.db.getPool();

    async requestBook(bookId, userId) {
        const [bookRows] = await this.pool().execute(
            `SELECT book_id, status FROM books WHERE book_id = ?`,
            [bookId]
        );
        const book = bookRows[0];

        if (!book) {
            throw new NotFoundException('Book not found');
        }
        if (book.status !== 'available') {
            throw new BadRequestException('Book is not available for request.');
        }
        
        const [existingRequest] = await this.pool().execute(
             `SELECT book_id FROM books WHERE borrower_id = ? AND book_id = ? AND status = 'requested'`,
             [userId, bookId]
        );
        if (existingRequest.length > 0) {
            throw new BadRequestException('You already have an active request for this book.');
        }

        const [result] = await this.pool().execute(
            `UPDATE books SET borrower_id = ?, status = 'requested' WHERE book_id = ?`,
            [userId, bookId]
        );

        return { success: result.affectedRows > 0, bookId, userId };
    }
    
    async cancelRequest(bookId, userId) {
        const [bookRows] = await this.pool().execute(
            `SELECT book_id, status, borrower_id FROM books WHERE book_id = ?`,
            [bookId]
        );
        const book = bookRows[0];
        
        if (!book || book.status !== 'requested') {
            throw new BadRequestException('Book is not currently requested or request status is invalid.');
        }
        if (book.borrower_id !== userId) {
            throw new BadRequestException('You can only cancel your own request.');
        }

        const [result] = await this.pool().execute(
            `UPDATE books SET borrower_id = NULL, status = 'available' WHERE book_id = ? AND borrower_id = ?`,
            [bookId, userId]
        );

        return { success: result.affectedRows > 0, bookId, userId };
    }
    
    async getBorrowedBooks(userId) {
        const [rows] = await this.pool().execute(
            `SELECT book_id, title, image_link, status, created_at, updated_at
             FROM books
             WHERE borrower_id = ? AND status IN ('requested', 'borrowed')`,
            [userId],
        );
        return rows;
    }
    
    async createBook(bookData) {
        const [result] = await this.pool().execute(
            `INSERT INTO books (title, image_link) VALUES (?, ?)`,
            [bookData.title, bookData.image_link]
        );
        return await this.findById((result).insertId);
    }

    async updateBook(bookId, partial) {
        const fields = [];
        const values = [];

        if (partial.title) {
            fields.push('title = ?');
            values.push(partial.title);
        }
        if (partial.image_link) {
            fields.push('image_link = ?');
            values.push(partial.image_link);
        }
        if (partial.status) {
            fields.push('status = ?');
            values.push(partial.status);
        }
        if (partial.borrower_id !== undefined) {
            fields.push('borrower_id = ?');
            values.push(partial.borrower_id);
        }

        if (fields.length === 0) return await this.findById(bookId);

        values.push(bookId);

        const sql = `UPDATE books SET ${fields.join(', ')} WHERE book_id = ?`;
        await this.pool().execute(sql, values);

        return await this.findById(bookId);
    }
    
    async deleteBook(bookId) {
        const [res] = await this.pool().execute('DELETE FROM books WHERE book_id = ?', [bookId]);
        return res.affectedRows > 0;
    }

    async rejectRequest(bookId, reason) {
        const [bookRows] = await this.pool().execute(
            `SELECT borrower_id FROM books WHERE book_id = ? AND status = 'requested'`,
            [bookId]
        );
        
        if (bookRows.length === 0) {
            throw new BadRequestException('No active request found for this book.');
        }

        const borrowerId = bookRows[0].borrower_id;

        await this.pool().execute(
            `UPDATE books SET borrower_id = NULL, status = 'available' WHERE book_id = ?`,
            [bookId]
        );

        const [userRows] = await this.pool().execute(
            `SELECT username FROM users WHERE id = ?`,
            [borrowerId]
        );
        const username = userRows[0]?.username || `User ID ${borrowerId}`;
        
        console.log(`[NOTIFICATION SENT] To: ${username} (ID: ${borrowerId}). Book ID ${bookId} request rejected. Reason: ${reason}`);

        return { success: true, message: `Request rejected and notification sent to ${username}.` };
    }


    async findById(bookId) {
        const [rows] = await this.pool().execute(
            `SELECT book_id, title, image_link, borrower_id, status, created_at, updated_at
             FROM books WHERE book_id = ?`,
            [bookId]
        );
        if (rows.length === 0) throw new NotFoundException('Book not found');
        return rows[0];
    }
    
    async getAllBooks() {
        const [rows] = await this.pool().execute(
            `SELECT book_id, title, image_link, borrower_id, status, created_at, updated_at 
             FROM books`
        );
        return rows;
    }
}
