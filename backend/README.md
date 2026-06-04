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
│   ├── main.ts                # bootstrap: prefijo /api/v1, CORS, puerto
│   ├── app.module.ts          # módulo raíz (ConfigModule global)
│   ├── health/                # endpoint de salud
│   ├── recommendation/        # motor de recomendación (port del frontend)
│   │   ├── data/              # reglas en JSON (single + mixed)
│   │   ├── recommendation.types.ts
│   │   ├── recommendation.service.ts
│   │   ├── recommendation.service.spec.ts   # tests de paridad
│   │   └── recommendation.module.ts
│   └── positioning/           # motor de posicionamiento de ruedas
│       ├── positioning.types.ts
│       ├── positioning.service.ts
│       ├── positioning.service.spec.ts      # tests de paridad
│       └── positioning.module.ts
├── .env.example
├── nest-cli.json
├── tsconfig.json
└── package.json
```

## Motor de recomendación y posicionamiento

`RecommendationService` y `PositioningService` son **ports fieles (1:1)** de la
lógica del frontend (`frontend/src/utils/wheelRecommendation.js` y
`calculateWheelPosition.js`). Los tests `*.spec.ts` son **tests de paridad**:
comparan la salida del backend con valores "golden" generados ejecutando las
funciones originales del frontend sobre los mismos inputs.

> Las reglas se cargan por ahora desde JSON empaquetado en
> `src/recommendation/data/`. Su migración a base de datos se aborda en el
> issue **#6**. Los endpoints HTTP que exponen estos servicios se añaden en el
> issue **#7**.

## Roadmap

Este backend avanza según la épica **#1**: scaffold (#3 ✅), motor portado
(#4 ✅), `/metadata` (#5), persistencia de reglas (#6), endpoints REST +
validación (#7), OpenAPI/Swagger (#8), tests (#9) y despliegue (#10).
