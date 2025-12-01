import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    pool!: mysql.Pool;

    async onModuleInit() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST ||'mysql-1586fd5a-gbox-ed0a.d.aivencloud.com',
            port: +(process.env.DB_PORT || 23418),
            user: process.env.DB_USER || 'avnadmin',
            password: process.env.DB_PASSWORD || 'AVNS_WXC_aTlVeyoAIIAd0S',
            database: process.env.DB_NAME || 'defaultdb',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        const conn = await this.pool.getConnection();
        await conn.ping();
        conn.release();
        console.log('Database connection established');
    }

    async onModuleDestroy() {
        await this.pool.end();
    }

    getPool(){
        return this.pool;
    }

}
