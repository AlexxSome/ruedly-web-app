# Ruedly - Recomendador de Ruedas para Patines en Línea

Aplicación web desarrollada con React 18 y Material UI v5 para recomendar ruedas de patines en línea según diferentes criterios de competencia.

## 🚀 Tecnologías

- **React 18** con Functional Components y Hooks
- **Vite** como bundler
- **Material UI v5** para la interfaz
- **@mui/icons-material** para iconos
- **@emotion/react** y **@emotion/styled** para estilos

## 📦 Instalación

```bash
npm install
```

## 🏃 Ejecutar en desarrollo

```bash
npm run dev
```

## 🏗️ Construir para producción

```bash
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Header.jsx
│   ├── WheelRecommendationForm.jsx
│   └── WheelRecommendationResult.jsx
├── data/
│   ├── wheelRulesMixed.json
│   └── wheelRulesSingle.json
├── utils/
│   └── wheelRecommendation.js
├── App.jsx
└── main.jsx
```

## 🎯 Funcionalidades

- Recomendación de ruedas basada en:
  - Disciplina (velocidad, fondo, skate cross, derrapes, free style)
  - Peso y edad
  - Nivel de experiencia
  - Estilo de patinar
  - Tipo de suelo/pista
  - Temperatura
  - Prioridad (agarre vs velocidad)
  - Tipo de dureza (numérica o estándar)
  - Tamaño de ruedas
  - Configuración del set (única, mixta automática, mixta personalizada)

## 🎨 Características

- Interfaz responsive con Material UI
- Tema personalizado con tonos verdes/azules
- Validación de formularios
- Recomendaciones con fallback cuando no hay coincidencia exacta
- Visualización clara de configuraciones mixtas por posición

## 📝 Licencia

Este proyecto es de uso personal/educativo.

