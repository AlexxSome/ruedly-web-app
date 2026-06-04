# Ruedly — App Móvil (Flutter)

Aplicación móvil de Ruedly para iOS y Android. Ofrece las dos funciones de la
web —recomendación de ruedas y posicionamiento de un set de 8— consumiendo la
API del backend (`../backend`).

## Stack

- **Flutter + Dart** (SDK ≥ 3.4)
- **flutter_riverpod** — gestión de estado
- **go_router** — navegación declarativa
- **flutter_lints** — análisis estático

> La capa de red (**dio**), los modelos (**freezed**/**json_serializable**) y la
> caché offline se añaden en issues posteriores (#12, #13, #17).

## Requisitos

- Flutter SDK instalado (`flutter doctor` sin errores)

## Comandos

```bash
cd mobile
flutter pub get        # instala dependencias
flutter run            # ejecuta en un emulador/dispositivo
flutter analyze        # análisis estático
flutter test           # tests
```

La URL base de la API se inyecta en compilación:

```bash
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000/api/v1
```

(`10.0.2.2` es el host visto desde el emulador de Android; en iOS usa
`http://localhost:3000/api/v1`.)

## Estructura (feature-first)

```
mobile/lib/
├── main.dart                 # entrada: ProviderScope + MaterialApp.router
├── core/
│   ├── theme/app_theme.dart  # paleta verde/azul (coherente con la web)
│   ├── router/app_router.dart# go_router
│   └── env/app_config.dart   # URL base de la API (--dart-define)
└── features/
    ├── home/                 # pantalla con pestañas
    ├── recommendation/       # recomendación (placeholder en #11)
    └── positioning/          # posicionamiento (placeholder en #11)
```

> Nota: este scaffold se escribió sin un SDK de Flutter en el entorno de
> desarrollo; ejecuta `flutter pub get` y `flutter analyze`/`flutter test` en
> una máquina con Flutter para generar `pubspec.lock` y validarlo (el workflow
> `mobile-ci.yml` lo hace en CI).

## Estado

Este scaffold corresponde al issue **#11** (épica #2). Próximos pasos: capa de
red y modelos (#12), estado con Riverpod (#13), pantallas de recomendación
(#14, #15), posicionamiento (#16), caché offline (#17), i18n/navegación (#18) y
builds/CI (#19).
