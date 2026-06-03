# AGENTS.md

Documento **canónico** para cualquier agente de IA (Claude Code, Copilot,
Cursor, etc.) que trabaje en este repositorio. Es la fuente de verdad sobre el
proyecto, su arquitectura y sus convenciones. `CLAUDE.md` simplemente apunta a
este archivo.

---

## 1. Qué es Ruedly

**Ruedly** es un recomendador de ruedas para **patines en línea** (inline
skating). Ayuda al patinador a decidir:

1. **Qué ruedas comprar/usar** — dureza, perfil, tamaño y configuración del
   set — a partir de su perfil (disciplina, peso, edad, nivel, estilo, suelo,
   temperatura y prioridad agarre/velocidad).
2. **Cómo posicionar** un conjunto de ruedas que ya posee en los dos patines
   (8 ruedas) para optimizar agarre o velocidad.

La aplicación está en español (UI y comentarios de código).

---

## 2. Estructura del monorepo

```
.
├── frontend/   # App web (React 18 + Vite + Material UI). Única app activa hoy.
├── backend/    # API / servicios. 🚧 Scaffolding, sin implementar.
├── mobile/     # App móvil. 🚧 Scaffolding, sin implementar.
├── README.md   # README del monorepo.
├── AGENTS.md   # Este archivo (canónico).
└── CLAUDE.md   # Puntero a AGENTS.md.
```

Cada subproyecto es **independiente**: tiene su propio `README.md` y su propia
gestión de dependencias. Trabaja siempre **dentro** del subproyecto
correspondiente (ejecuta `npm` desde `frontend/`, no desde la raíz).

| Carpeta     | Estado        | Descripción                                          |
|-------------|---------------|------------------------------------------------------|
| `frontend/` | ✅ Activa      | Web app React + Vite. Recomendador y posicionador.   |
| `backend/`  | 🚧 Pendiente  | API que expondrá el motor de recomendación.          |
| `mobile/`   | 🚧 Pendiente  | App móvil que reutilizará la lógica.                 |

---

## 3. Frontend (`frontend/`)

### 3.1 Stack

- **React 18** — componentes funcionales + hooks (`useState`). Sin Redux ni
  router; estado local en `App.jsx`.
- **Vite 5** — bundler y dev server.
- **Material UI v5** — `@mui/material`, `@mui/icons-material`,
  `@emotion/react`, `@emotion/styled`. También `react-icons`.
- Despliegue en **GitHub Pages** vía `gh-pages`.

### 3.2 Comandos

```bash
cd frontend
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo (Vite)
npm run build      # build de producción -> dist/
npm run preview    # previsualizar el build
npm run deploy     # predeploy (build) + publicar dist/ en GitHub Pages
```

> **Importante:** `frontend/vite.config.js` fija `base: '/ruedly-web-app/'`
> porque se publica en `https://<usuario>.github.io/ruedly-web-app/`. No
> cambies ese `base` salvo que cambie la URL de publicación.

No hay configuración de tests ni de linter en el proyecto actualmente; la
verificación mínima es que `npm run build` compile sin errores.

### 3.3 Organización del código

```
frontend/
├── index.html                  # HTML raíz; carga /src/main.jsx
├── vite.config.js              # plugin React + base de GitHub Pages
├── package.json
└── src/
    ├── main.jsx                # punto de entrada (ReactDOM.createRoot + StrictMode)
    ├── App.jsx                 # raíz: ThemeProvider, tema MUI, estado y pestañas
    ├── components/             # UI (PascalCase.jsx)
    │   ├── Header.jsx
    │   ├── RuedlyLogo.jsx
    │   ├── WheelRecommendationForm.jsx     # formulario de la pestaña 1
    │   ├── WheelRecommendationResult.jsx   # resultado de la pestaña 1
    │   ├── WheelPositionForm.jsx           # formulario de la pestaña 2
    │   └── WheelPositionResult.jsx         # resultado de la pestaña 2
    ├── utils/                  # lógica de negocio pura (sin React)
    │   ├── wheelRecommendation.js          # getWheelRecommendation(form)
    │   └── calculateWheelPosition.js       # calculateWheelPosition(data)
    └── data/                   # reglas de recomendación en JSON
        ├── wheelRulesSingle.json           # 15 reglas, set de dureza única
        └── wheelRulesMixed.json            # 13 reglas, set mixto (mixedConfig)
```

> Nota: existen copias huérfanas `frontend/wheelRulesMixed.json` y
> `frontend/wheelRulesSingle.json` en la raíz de `frontend/`. **No se usan**;
> el código importa los de `src/data/`. Pueden eliminarse.

### 3.4 Arquitectura

- **Separación UI / lógica**: toda la lógica de negocio vive en `utils/` como
  **funciones puras** que reciben un objeto de formulario y devuelven un
  resultado. Los **componentes** sólo manejan UI y estado local.
- **`App.jsx`** orquesta: define el tema (verdes/azules), mantiene el estado
  (`result`, `positionResult`, `tabValue`), renderiza dos pestañas (`Tabs`) y
  conecta cada formulario con su función de `utils/` y su componente de
  resultado. Layout de dos columnas con `Grid` (formulario | resultado).
- **Las reglas son datos, no código**: las recomendaciones se definen en
  `data/*.json`. Para cambiar o añadir comportamiento de recomendación, edita
  el JSON; no hardcodees reglas en el motor.

### 3.5 Pestaña 1 — Recomendación de ruedas

`getWheelRecommendation(form)` en `utils/wheelRecommendation.js`:

1. **Valida** que estén todos los campos requeridos; si falta alguno devuelve
   `{ error }`.
2. **Selecciona el conjunto de reglas** según `modoDureza`:
   - `"numérica (82A–90A)"` → reglas con `mode === "numeric"`.
   - estándar → reglas con `mode === "standard"`.
   - Combina `wheelRulesMixed` + `wheelRulesSingle`.
3. **Filtra por `setConfigMode`**: "Automática según la regla" usa reglas con
   `mixedConfig`; "Dureza única en todo el set" usa reglas sin `mixedConfig`;
   los modos mixtos personalizados consideran todas.
4. **Puntúa cada regla** con `calculateMatchScore` (ver tabla abajo). La
   disciplina es obligatoria: si no coincide, la regla se descarta (`-1`).
5. **Elige la de mayor score.** Si no hay ninguna con score ≥ 10, usa
   `getDefaultRecommendation` (**fallback**, `isFallback: true`).
6. **Aplica `applySetConfig`** para transformar la recomendación según el
   `setConfigMode` (genera `mixedConfig` por posición 1–4 cuando aplica).
7. Devuelve `{ recommendation, matchScore, isFallback, ruleId? }`.

**Pesos del score** (`calculateMatchScore`):

| Condición     | Puntos | Notas                                  |
|---------------|:------:|----------------------------------------|
| disciplina    |  +10   | Obligatoria; si no coincide → descarta |
| rangoPesoKg   |  +5    | `min`/`max`                            |
| rangoEdad     |  +5    | `min`/`max`                            |
| experiencia   |  +5    | lista                                  |
| estilo        |  +5    | lista                                  |
| suelo         |  +5    | lista                                  |
| priority      |  +5    | lista                                  |
| temperatura   |  +3    | `"sin especificar"` normalizado        |

### 3.6 Pestaña 2 — Posicionamiento de ruedas

`calculateWheelPosition(data)` en `utils/calculateWheelPosition.js`:

- Entrada: `{ wheels: [{ hardness, quantity }], userData: {...} }`.
- **Exige exactamente 8 ruedas** (4 por patín); si no, devuelve `{ error }`.
- Ordena las ruedas de más blanda a más dura (`getHardnessOrder` mapea tanto
  `Firm/XFirm/XXFirm` como `82A`–`90A`).
- `determinePositioningStrategy` calcula `frontBias` y `speedBias` (0–1)
  ajustando por prioridad, disciplina, estilo, suelo y temperatura.
- Reparte las 8 ruedas entre `rightFoot[4]` y `leftFoot[4]`:
  - `frontBias ≥ 0.5`: más blandas delante (agarre), más duras atrás.
  - `frontBias < 0.5`: más duras delante (velocidad pura).
  - Si todas son iguales: distribución uniforme.
- Devuelve `{ rightFoot, leftFoot, strategy, userContext }`.

### 3.7 Esquema de una regla (`data/*.json`)

```jsonc
{
  "id": "velocidad_pista_principiante_Firm_50_70kg", // identificador único legible
  "mode": "standard",                                // "standard" | "numeric"
  "conditions": {
    "disciplina": ["velocidad"],
    "rangoPesoKg": { "min": 50, "max": 70 },
    "rangoEdad":   { "min": 10, "max": 25 },
    "experiencia": ["principiante"],
    "estilo":      ["mixto"],
    "suelo":       ["pista"],
    "temperatura": ["templado", "sin especificar"],
    "priority":    ["Más agarre"]
  },
  "recommendation": {
    "hardness": "Firm",          // Firm/XFirm/XXFirm (standard) o 82A–90A (numeric)
    "profile":  "Elíptico",      // p. ej. Elíptico, Bullet
    "notes":    "Explicación para el usuario.",
    "mixedConfig": null          // null = set único; objeto = config por posición 1–4
  }
}
```

`mixedConfig` (cuando no es `null`):

```jsonc
"mixedConfig": {
  "positions": { "1": "Firm", "2": "Firm", "3": "XFirm", "4": "XFirm" },
  "description": "Delante más blando para agarre; atrás más duro para velocidad."
}
```

### 3.8 Valores admitidos en los formularios

Mantén estos valores consistentes entre los formularios, el motor y los JSON:

- **disciplina**: `velocidad`, `fondo`, `skate cross`, `derrapes`,
  `free style (calle)`.
- **experiencia**: `principiante`, `intermedio`, `avanzado`,
  `alta competencia`, `alto rendimiento`.
- **estilo**: `explosivo (velocidad)`, `fondo`, `mixto`, `tecnico`,
  `free style`.
- **suelo**: `pista`, `asfalto liso`, `asfalto rugoso`, `indoor`, `calle`.
- **temperatura**: `sin especificar`, `frio`, `templado`, `caluroso`.
- **priority**: `Más agarre`, `Más velocidad`, `Balance entre agarre y velocidad`.
- **modoDureza**: `numérica (82A–90A)`, estándar (`Firm`/`XFirm`/`XXFirm`).
- **wheelSize (mm)**: `80`, `84`, `90`, `100`, `110`, `125`.
- **setConfigMode**: `Automática según la regla`,
  `Dureza única en todo el set`,
  `Mixto: más agarre delante, más velocidad atrás`,
  `Mixto: configuración de control y agarre`.

---

## 4. Backend (`backend/`) y Mobile (`mobile/`)

Aún **sin implementar**; sólo contienen un `README.md` de scaffolding. Antes
de añadir código:

1. Define el stack en el `README.md` correspondiente (p. ej. backend con
   Node/Express o NestJS; mobile con React Native + Expo).
2. Crea su propia gestión de dependencias **dentro** de la carpeta.

Visión: el **backend** expondrá el motor de recomendación (hoy en
`frontend/src/utils` + `data/*.json`) como API, y **mobile** reutilizará esa
lógica para ofrecer la misma experiencia en iOS/Android.

---

## 5. Convenciones

- **Nombres**: componentes en `PascalCase.jsx`; utilidades en `camelCase.js`.
- **Estilado**: Material UI (`sx`, `ThemeProvider`, `createTheme`). El tema
  (paleta verde `#2E7D32` / azul `#1976D2`, `borderRadius: 8`) se define en
  `App.jsx`.
- **Idioma**: comentarios y textos de UI en **español**.
- **Lógica de negocio** en `utils/` como funciones puras; los componentes no
  contienen reglas de recomendación.
- **Reglas** nuevas o modificadas van en `data/*.json`, manteniendo el
  esquema y los valores admitidos de la sección 3.8.

---

## 6. Reglas de trabajo para agentes

- Trabaja en la **rama de desarrollo** indicada por la tarea; **no** hagas
  push a `main` sin permiso explícito.
- Usa `git mv` al mover/renombrar archivos para conservar el historial.
- **No versiones** artefactos de build ni cachés (`dist/`, `node_modules/`,
  `.vite/`, `.expo/`, `*.apk`, `*.ipa`, …); ya están en `.gitignore`.
- **No crees Pull Requests** salvo que se pida explícitamente.
- Tras un cambio que afecte al frontend, verifica con `npm run build`.
- Si actualizas este archivo, recuerda que `CLAUDE.md` sólo lo referencia: no
  necesitas duplicar contenido allí.
