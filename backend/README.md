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
(#4 ✅), `/metadata` (#5 ✅), endpoints REST + validación (#7 ✅),
OpenAPI/Swagger (#8 ✅), persistencia de reglas (#6), tests (#9) y
despliegue (#10).

## Documentación de la API (OpenAPI/Swagger)

Con el servidor levantado:

- **Swagger UI**: `http://localhost:3000/api/docs`
- **OpenAPI JSON**: `http://localhost:3000/api/docs-json`

Para exportar el contrato a un fichero (lo consume el generador de cliente de
la app móvil):

```bash
npm run openapi   # genera backend/openapi.json
```

### CORS

Los orígenes permitidos se configuran con la variable `CORS_ORIGINS` (lista
separada por comas). Si está vacía, se permiten todos los orígenes (útil en
desarrollo).

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/api/v1/health` | Estado del servicio |
| `GET`  | `/api/v1/metadata` | Catálogo de factores (`?flow=recommendation\|positioning`) |
| `POST` | `/api/v1/recommendation` | Recomendación a partir del perfil del patinador |
| `POST` | `/api/v1/wheel-position` | Distribución de 8 ruedas en ambos patines |
| `GET`  | `/api/v1/rules` | Reglas vigentes (lectura) |

Las entradas se validan con DTOs (`class-validator`); los valores admitidos de
los enums se toman del catálogo de `/metadata`. Un payload inválido devuelve
**400** con formato uniforme `{ statusCode, error, message, path, timestamp }`.

## Endpoint de metadatos

`GET /api/v1/metadata` devuelve el **catálogo de factores y valores admitidos**
(disciplinas, suelos, estilos, temperaturas, durezas, tamaños, modos de set…),
los pesos del scoring y la config del posicionamiento. Es la **fuente única**
para que web y móvil construyan sus formularios; añadir un valor a un factor no
requiere cambios en los clientes. Soporta filtrar por flujo:

```bash
curl http://localhost:3000/api/v1/metadata
curl "http://localhost:3000/api/v1/metadata?flow=recommendation"
curl "http://localhost:3000/api/v1/metadata?flow=positioning"
```
