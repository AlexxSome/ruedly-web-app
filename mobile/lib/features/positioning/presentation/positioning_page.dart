import 'package:flutter/material.dart';

/// Pantalla de posicionamiento de ruedas.
///
/// Placeholder del scaffold (#11). El formulario de las 8 ruedas y el
/// resultado por patín se implementan en el issue #16.
class PositioningPage extends StatelessWidget {
  const PositioningPage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.settings, size: 64, color: theme.colorScheme.primary),
            const SizedBox(height: 16),
            Text('Posicionamiento de Ruedas',
                style: theme.textTheme.titleLarge),
            const SizedBox(height: 8),
            Text(
              'Aquí irá el formulario de las 8 ruedas y la distribución '
              'recomendada en cada patín.',
              textAlign: TextAlign.center,
              style: theme.textTheme.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }
}
