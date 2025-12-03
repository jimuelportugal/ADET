import { Module, Global } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [DatabaseModule, PassportModule],
    controllers: [BooksController],
    providers: [BooksService],
})
export class BooksModule {}
