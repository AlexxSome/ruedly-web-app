import 'package:flutter/material.dart';

/// Pantalla de recomendación de ruedas.
///
/// Placeholder del scaffold (#11). El formulario multi-factor, la capa de red
/// y los resultados se implementan en los issues #12, #13, #14 y #15.
class RecommendationPage extends StatelessWidget {
  const RecommendationPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const _ComingSoon(
      icon: Icons.speed,
      title: 'Recomendación de Ruedas',
      description:
          'Aquí irá el formulario multi-factor (disciplina, peso, suelo, '
          'clima, prioridad…) y la recomendación del backend.',
    );
  }
}

class _ComingSoon extends StatelessWidget {
  const _ComingSoon({
    required this.icon,
    required this.title,
    required this.description,
  });

  final IconData icon;
  final String title;
  final String description;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 64, color: theme.colorScheme.primary),
            const SizedBox(height: 16),
            Text(title, style: theme.textTheme.titleLarge),
            const SizedBox(height: 8),
            Text(
              description,
              textAlign: TextAlign.center,
              style: theme.textTheme.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }
}
