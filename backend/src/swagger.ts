import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

/** Construye el documento OpenAPI a partir de la app Nest. */
export function buildOpenApiDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('Ruedly API')
    .setDescription(
      'API del motor de recomendación y posicionamiento de ruedas de Ruedly.',
    )
    .setVersion('1.0')
    .addTag('recommendation', 'Recomendación de ruedas')
    .addTag('positioning', 'Posicionamiento de ruedas')
    .addTag('metadata', 'Catálogo de factores y valores admitidos')
    .addTag('health', 'Estado del servicio')
    .build();

  return SwaggerModule.createDocument(app, config);
}

/** Monta la UI de Swagger en `/api/docs` y devuelve el documento. */
export function setupSwagger(app: INestApplication): OpenAPIObject {
  const document = buildOpenApiDocument(app);
  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'api/docs-json',
  });
  return document;
}
