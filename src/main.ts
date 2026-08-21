import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );
  
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    methods: 'POST',
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

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
