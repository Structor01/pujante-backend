import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar CORS
  app.enableCors({
    origin: true, // Permitir todas as origens em desenvolvimento
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configurar validação global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Prefixo global para API
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
  console.log('🚀 Servidor Pujante rodando na porta', process.env.PORT || 3000);
}
bootstrap();
