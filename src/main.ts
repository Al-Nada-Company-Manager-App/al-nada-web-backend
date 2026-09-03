import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { Express } from 'express';

let cachedServer: Express;

async function bootstrap(): Promise<Express> {
  if (!cachedServer) {
    const server = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );
    
    const envOrigins = process.env.FRONTEND_ORIGIN 
      ? process.env.FRONTEND_ORIGIN.split(',').map(o => o.trim().replace(/\/$/, ''))
      : [];
    
    const allowedOrigins = [
      ...envOrigins,
      'http://localhost:3000',
      'http://localhost:5174',
      'https://alnadascientific.com',
      'https://www.alnadascientific.com',
      'https://nada-admin.vercel.app',
    ];

    app.enableCors({
      origin: allowedOrigins,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: false,
    });

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }));

    app.setGlobalPrefix('api');

    await app.init();
    cachedServer = server;
  }
  return cachedServer;
}

if (process.env.NODE_ENV !== 'production') {
  bootstrap().then((server) => {
    const port = process.env.PORT || 3001;
    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  });
}

export default async (req: any, res: any) => {
  const server = await bootstrap();
  return server(req, res);
};
