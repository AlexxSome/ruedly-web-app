/// Configuración de entorno de la app.
///
/// La URL base de la API se inyecta en tiempo de compilación con
/// `--dart-define=API_BASE_URL=...`. Por defecto apunta al backend local
/// (emulador Android usa `10.0.2.2` para alcanzar el host).
class AppConfig {
  AppConfig._();

  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:3000/api/v1',
  );
}
