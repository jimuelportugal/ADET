import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { BooksModule } from './books/books.module';
import { PositionsModule } from './positions/positions.module';

@Module ({
    imports: [DatabaseModule, UsersModule, AuthModule, BooksModule, PositionsModule],
    controllers: [AppController],
})
export class AppModule {}
