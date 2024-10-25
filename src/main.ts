import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformationInterceptor } from './responseInterceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOption = {
    origin: true,
    credentials: true,
    methods: 'GET,POST',
    allowedHeaders:'Content-Type, Authorization'
  };
  app.enableCors(corsOption);
  app.useGlobalInterceptors(new TransformationInterceptor())

  app.useGlobalPipes( new ValidationPipe({
    whitelist:true
  }));

  app.setGlobalPrefix('api')

  const port  = process.env.SERVER_PORT


  await app.listen(3000);
}
bootstrap();
