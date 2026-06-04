import 'package:flutter/material.dart';

/// Identidad visual de Ruedly, coherente con la web (verde/azul).
class AppTheme {
  AppTheme._();

  /// Verde primario (mismo tono que el tema MUI de la web).
  static const Color green = Color(0xFF2E7D32);

  /// Azul secundario.
  static const Color blue = Color(0xFF1976D2);

  static ThemeData get light {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: green,
      primary: green,
      secondary: blue,
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: const Color(0xFFF5F5F5),
      appBarTheme: const AppBarTheme(
        backgroundColor: green,
        foregroundColor: Colors.white,
        centerTitle: false,
      ),
    );
  }
}
