import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class PositionsService {
    constructor(private db: DatabaseService) { }

    private pool = () => this.db.getPool();

    async createPositions(positionData: { position_code: string; position_name: string }, userId: number) {
        const [result] = await this.pool().execute(
            `INSERT INTO positions (position_code, position_name, id)
     VALUES (?, ?, ?)`,
            [positionData.position_code, positionData.position_name, userId]
        );

        return {
            position_id: (result as any).insertId,
            ...positionData,
            id: userId,
        };
    }

    async getAll() {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT position_id, position_code, position_name, id, created_at, updated_at FROM positions`
        );
        return rows;
    }

    async findById(position_id: number) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            `SELECT position_id, position_code, position_name, id, created_at, updated_at
             FROM positions WHERE position_id = ?`,
            [position_id]
        );
        if (rows.length === 0) throw new NotFoundException('Position not found');
        return rows[0];
    }

    async updatePositions(position_id: number, partial: { position_code?: string; position_name?: string }) {
        const fields: string[] = [];
        const values: any[] = [];

        if (partial.position_code) {
            fields.push('position_code = ?');
            values.push(partial.position_code);
        }
        if (partial.position_name) {
            fields.push('position_name = ?');
            values.push(partial.position_name);
        }

        if (fields.length === 0) return await this.findById(position_id);
        values.push(position_id);

        const sql = `UPDATE positions SET ${fields.join(', ')} WHERE position_id = ?`;
        await this.pool().execute(sql, values);

        return await this.findById(position_id);
    }

    async deletePositions(position_id: number) {
        const [res] = await this.pool().execute<OkPacket>(
            'DELETE FROM positions WHERE position_id = ?',
            [position_id]
        );
        return res.affectedRows > 0;
    }
}

// positions.service.ts