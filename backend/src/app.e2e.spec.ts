import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

const validForm = {
  disciplina: 'velocidad',
  pesoKg: 60,
  edad: 18,
  experiencia: 'principiante',
  estilo: 'mixto',
  suelo: 'pista',
  temperatura: 'templado',
  priority: 'Más agarre',
  modoDureza: 'estándar (Firm/XFirm/XXFirm)',
  wheelSize: 100,
  setConfigMode: 'Dureza única en todo el set',
};

const validPositioning = {
  wheels: [
    { hardness: 'Firm', quantity: 4 },
    { hardness: 'XFirm', quantity: 4 },
  ],
  userData: {
    disciplina: 'fondo',
    pesoKg: 70,
    experiencia: 'intermedio',
    estilo: 'mixto',
    suelo: 'pista',
    temperatura: 'templado',
    priority: 'Más agarre',
  },
};

describe('API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health -> 200', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('ok'));
  });

  it('GET /api/v1/metadata -> 200 con factores', () => {
    return request(app.getHttpServer())
      .get('/api/v1/metadata')
      .expect(200)
      .expect((res) => expect(res.body.factors.length).toBeGreaterThan(0));
  });

  it('GET /api/v1/rules -> 200 lista de reglas', () => {
    return request(app.getHttpServer())
      .get('/api/v1/rules')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('POST /api/v1/recommendation válido -> 201 con recomendación', () => {
    return request(app.getHttpServer())
      .post('/api/v1/recommendation')
      .send(validForm)
      .expect(201)
      .expect((res) => {
        expect(res.body.recommendation.hardness).toBe('Firm');
        expect(res.body.isFallback).toBe(false);
      });
  });

  it('POST /api/v1/recommendation inválido -> 400 con formato uniforme', () => {
    return request(app.getHttpServer())
      .post('/api/v1/recommendation')
      .send({ ...validForm, disciplina: 'inexistente', pesoKg: -5 })
      .expect(400)
      .expect((res) => {
        expect(res.body.statusCode).toBe(400);
        expect(res.body.path).toBe('/api/v1/recommendation');
        expect(res.body.timestamp).toBeTruthy();
        expect(Array.isArray(res.body.message)).toBe(true);
      });
  });

  it('POST /api/v1/recommendation con campo desconocido -> 400', () => {
    return request(app.getHttpServer())
      .post('/api/v1/recommendation')
      .send({ ...validForm, hacker: true })
      .expect(400);
  });

  it('POST /api/v1/wheel-position válido -> 201 con ambos pies', () => {
    return request(app.getHttpServer())
      .post('/api/v1/wheel-position')
      .send(validPositioning)
      .expect(201)
      .expect((res) => {
        expect(res.body.rightFoot).toHaveLength(4);
        expect(res.body.leftFoot).toHaveLength(4);
      });
  });

  it('POST /api/v1/wheel-position estructura inválida -> 400', () => {
    return request(app.getHttpServer())
      .post('/api/v1/wheel-position')
      .send({ wheels: [] })
      .expect(400);
  });
});
