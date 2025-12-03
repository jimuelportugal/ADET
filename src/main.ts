import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT || 3000;
    
    // Explicitly configure CORS to accept requests from both development and production URLs.
    app.enableCors({
        origin: [
            // Your local development server address
            'http://2.3.1.98:3000',
            'http://localhost:3000',
            'https://nextjs-aut.onrender.com' 
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // Important for cookies/authentication headers
    });
    
    await app.listen(port);
    console.log(`server listening on: http://localhost:${port}`);
}
bootstrap();

