# Ruedly

Monorepo de **Ruedly**, el recomendador de ruedas para patines en línea. El
proyecto se organiza en tres aplicaciones independientes:

```
.
├── frontend/   # Aplicación web (React 18 + Vite + Material UI)
├── backend/    # API REST (NestJS + TypeScript)
└── mobile/     # Aplicación móvil (Flutter)
```

## 📁 Estructura

| Carpeta     | Descripción                                              | Estado         |
|-------------|----------------------------------------------------------|----------------|
| `frontend/` | Web app en React + Vite. Recomendador de ruedas.         | ✅ Activa       |
| `backend/`  | API REST (NestJS) del motor de recomendación, compartida por web y móvil. | ✅ API operativa |
| `mobile/`   | App móvil en Flutter que consume la API.                 | 🟡 Scaffold     |

Cada subproyecto tiene su propio `README.md` y su propia gestión de
dependencias, por lo que pueden desarrollarse, instalarse y desplegarse de
forma independiente.

## 🚀 Inicio rápido

### Frontend (web)

```bash
cd frontend
npm install
npm run dev
```

### Backend (API)

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev        # API en http://localhost:3000/api/v1
# Documentación: http://localhost:3000/api/docs
```

### Móvil (Flutter)

```bash
cd mobile
flutter pub get
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000/api/v1
```

## 📝 Licencia

Proyecto de uso personal/educativo.
