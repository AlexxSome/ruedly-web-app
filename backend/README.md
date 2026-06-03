# Ruedly — Backend

API y servicios de servidor para Ruedly. Aquí vive (o vivirá) el motor de
recomendación de ruedas compartido entre la aplicación web (`../frontend`) y la
móvil (`../mobile`).

## Stack

- **NestJS 10** + **TypeScript** (estructura modular, validación y Swagger
  integrados).
- Todas las rutas se sirven bajo el prefijo **`/api/v1`**.
- Configuración por entorno con `@nestjs/config` (`.env`).
- Tests con **Jest**; lint con **ESLint** + **Prettier**.

## Requisitos

- Node.js ≥ 20
- npm

## Instalación

```bash
cd backend
cp .env.example .env   # ajusta el PUERTO si lo necesitas
npm install
```

## Comandos

```bash
npm run start:dev      # servidor en modo watch
npm run build          # compila a dist/
npm run start:prod     # ejecuta el build (node dist/main.js)
npm run lint           # ESLint + Prettier
npm test               # tests con Jest
```

## Health check

Con el servidor levantado:

```bash
curl http://localhost:3000/api/v1/health
# { "status": "ok", "service": "ruedly-backend", "timestamp": "..." }
```

## Estructura

```
backend/
├── src/
│   ├── main.ts            # bootstrap: prefijo /api/v1, CORS, puerto
│   ├── app.module.ts      # módulo raíz (ConfigModule global)
│   └── health/            # endpoint de salud
│       ├── health.controller.ts
│       ├── health.module.ts
│       └── health.controller.spec.ts
├── .env.example
├── nest-cli.json
├── tsconfig.json
└── package.json
```

## Roadmap

Este scaffold corresponde al issue de inicialización del backend. Los
siguientes pasos (motor de recomendación, `/metadata`, persistencia de reglas,
endpoints REST, OpenAPI/Swagger, tests y despliegue) están descritos en la
épica **#1** y sus issues asociados.
