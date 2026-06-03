import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Todas las rutas se sirven bajo /api/v1
  app.setGlobalPrefix('api/v1');

  // CORS para los clientes web (GitHub Pages) y la futura app móvil.
  // Se afinará por origen en el issue de OpenAPI/CORS (#8).
  app.enableCors();

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3000);

  await app.listen(port);
  Logger.log(
    `Ruedly backend escuchando en http://localhost:${port}/api/v1`,
    'Bootstrap',
  );
}

bootstrap();
