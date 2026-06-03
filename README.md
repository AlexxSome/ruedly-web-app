# Ruedly

Monorepo de **Ruedly**, el recomendador de ruedas para patines en línea. El
proyecto se organiza en tres aplicaciones independientes:

```
.
├── frontend/   # Aplicación web (React 18 + Vite + Material UI)
├── backend/    # API / servicios (por implementar)
└── mobile/      # Aplicación móvil (por implementar)
```

## 📁 Estructura

| Carpeta     | Descripción                                              | Estado        |
|-------------|----------------------------------------------------------|---------------|
| `frontend/` | Web app en React + Vite. Recomendador de ruedas.         | ✅ Activa      |
| `backend/`  | API y lógica de servidor compartida por web y móvil.     | 🚧 Pendiente  |
| `mobile/`    | App móvil que reutilizará la lógica de recomendación.    | 🚧 Pendiente  |

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

### Backend

```bash
cd backend
# Ver backend/README.md
```

### Móvil

```bash
cd mobile
# Ver mobile/README.md
```

## 📝 Licencia

Proyecto de uso personal/educativo.
