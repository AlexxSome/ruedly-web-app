# Ruedly — Backend

API y servicios de servidor para Ruedly. Aquí vivirá la lógica de negocio
compartida entre la aplicación web (`../frontend`) y la móvil (`../mobile`),
por ejemplo:

- Motor de recomendación de ruedas expuesto como API.
- Persistencia de reglas (`wheelRules*.json`) y catálogos.
- Autenticación y perfiles de usuario (futuro).

## Estado

🚧 **Pendiente de implementación.** Esta carpeta es el contenedor del futuro
backend. Define aquí el stack elegido (por ejemplo Node.js/Express, NestJS,
FastAPI, etc.) y añade su gestión de dependencias correspondiente.

## Estructura sugerida

```
backend/
├── src/
│   ├── routes/
│   ├── services/
│   └── data/
├── package.json
└── README.md
```
