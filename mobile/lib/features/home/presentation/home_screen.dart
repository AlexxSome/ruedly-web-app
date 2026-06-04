import 'package:flutter/material.dart';

import '../../positioning/presentation/positioning_page.dart';
import '../../recommendation/presentation/recommendation_page.dart';

/// Pantalla principal con las dos funciones de Ruedly en pestañas,
/// equivalente a los `Tabs` de la web.
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Ruedly'),
          bottom: const TabBar(
            indicatorColor: Colors.white,
            tabs: [
              Tab(text: 'Recomendación'),
              Tab(text: 'Posicionamiento'),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            RecommendationPage(),
            PositioningPage(),
          ],
        ),
      ),
    );
  }
}
