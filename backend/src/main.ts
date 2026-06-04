import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Todas las rutas se sirven bajo /api/v1
  app.setGlobalPrefix('api/v1');

  // Validación automática de los DTOs entrantes.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Formato uniforme de errores.
  app.useGlobalFilters(new AllExceptionsFilter());

  // CORS: orígenes desde CORS_ORIGINS (separados por coma) o todos por defecto.
  const corsOrigins = config.get<string>('CORS_ORIGINS');
  app.enableCors({
    origin: corsOrigins ? corsOrigins.split(',').map((o) => o.trim()) : true,
  });

  // Documentación OpenAPI/Swagger en /api/docs (+ JSON en /api/docs-json).
  setupSwagger(app);

  const port = config.get<number>('PORT', 3000);

  await app.listen(port);
  Logger.log(
    `Ruedly backend escuchando en http://localhost:${port}/api/v1`,
    'Bootstrap',
  );
  Logger.log(`Swagger UI en http://localhost:${port}/api/docs`, 'Bootstrap');
}

bootstrap();
