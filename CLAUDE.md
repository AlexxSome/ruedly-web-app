# CLAUDE.md

Guía para Claude Code (y otros agentes) al trabajar en este repositorio.

## Qué es Ruedly

**Ruedly** es un recomendador de ruedas para patines en línea. Sugiere la
dureza, el tamaño y la configuración del set de ruedas según la disciplina,
el peso, el nivel, el tipo de suelo, la temperatura y otras condiciones del
patinador.

## Estructura del monorepo

```
.
├── frontend/   # App web (React 18 + Vite + Material UI). Única app activa hoy.
├── backend/    # API / servicios. 🚧 Scaffolding, sin implementar.
├── mobile/     # App móvil. 🚧 Scaffolding, sin implementar.
├── README.md   # README del monorepo.
├── CLAUDE.md   # Este archivo.
└── AGENTS.md   # Guía equivalente para agentes (mismo contenido base).
```

Cada subproyecto es independiente: tiene su propio `README.md` y su propia
gestión de dependencias. Trabaja siempre **dentro** del subproyecto
correspondiente (p. ej. ejecuta `npm` desde `frontend/`, no desde la raíz).

## Frontend (`frontend/`)

Stack: **React 18** (componentes funcionales + hooks), **Vite 5** como
bundler y **Material UI v5** (`@mui/material`, `@mui/icons-material`,
`@emotion`).

### Comandos

```bash
cd frontend
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo (Vite)
npm run build      # build de producción -> dist/
npm run preview    # previsualizar el build
npm run deploy     # publicar dist/ en GitHub Pages (gh-pages)
```

> El despliegue usa GitHub Pages con `base: '/ruedly-web-app/'` definido en
> `frontend/vite.config.js`. No cambies ese `base` salvo que cambie la URL de
> publicación.

### Organización del código

```
frontend/src/
├── main.jsx                    # punto de entrada (ReactDOM.createRoot)
├── App.jsx                     # raíz: tema MUI + estado + pestañas
├── components/                 # componentes de UI (PascalCase.jsx)
│   ├── Header.jsx
│   ├── RuedlyLogo.jsx
│   ├── WheelRecommendationForm.jsx / WheelRecommendationResult.jsx
│   └── WheelPositionForm.jsx / WheelPositionResult.jsx
├── utils/                      # lógica de negocio pura (sin React)
│   ├── wheelRecommendation.js  # getWheelRecommendation(formData)
│   └── calculateWheelPosition.js
└── data/                       # reglas en JSON
    ├── wheelRulesSingle.json   # reglas para set único
    └── wheelRulesMixed.json    # reglas para set mixto
```

Arquitectura: la **lógica de negocio vive en `utils/`** como funciones puras
que reciben los datos del formulario y devuelven una recomendación calculada
por *score* contra las reglas de `data/*.json`. Los **componentes** sólo
manejan UI y estado local; `App.jsx` orquesta los formularios, ejecuta las
funciones de `utils/` y guarda los resultados en estado.

### Convenciones

- Componentes en **PascalCase** con extensión `.jsx`; utilidades en
  **camelCase** con extensión `.js`.
- Estilado con Material UI (prop `sx`, `ThemeProvider`, `createTheme`); el
  tema (verdes/azules) se define en `App.jsx`.
- Comentarios y textos de UI en **español**.
- Las nuevas reglas de recomendación se añaden a los JSON de `data/`, no se
  hardcodean en el código.

## Backend (`backend/`) y Mobile (`mobile/`)

Aún sin implementar. Antes de añadir código, define el stack en el `README.md`
correspondiente y crea su propia gestión de dependencias dentro de la carpeta.
La idea es que el **backend** exponga el motor de recomendación como API y que
la app **mobile** reutilice esa lógica.

## Reglas de trabajo

- Realiza los cambios en la rama de desarrollo indicada por la tarea; **no**
  hagas push a `main` sin permiso explícito.
- Usa `git mv` al mover/renombrar archivos para conservar el historial.
- No versiones artefactos de build ni cachés (`dist/`, `node_modules/`,
  `.vite/`, `.expo/`, etc.); ya están en `.gitignore`.
- No crees Pull Requests salvo que se pida explícitamente.
- Verifica el frontend con `npm run build` antes de dar por terminado un
  cambio que lo afecte.
