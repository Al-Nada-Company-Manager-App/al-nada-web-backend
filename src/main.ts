import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

import { Express } from 'express';

const server: Express = express();

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );
  
  const envOrigins = process.env.FRONTEND_ORIGIN 
    ? process.env.FRONTEND_ORIGIN.split(',').map(o => o.trim().replace(/\/$/, ''))
    : [];
  
  // Guarantee that localhost and the production sites are always allowed
  const allowedOrigins = [
    ...envOrigins,
    'http://localhost:3000',
    'http://localhost:5174',    // nada-admin dev
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
}

bootstrap().then(() => {
  if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3001;
    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
});

export default server;
