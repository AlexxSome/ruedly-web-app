import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ruedly_mobile/main.dart';

void main() {
  testWidgets('arranca y muestra las dos pestañas', (tester) async {
    await tester.pumpWidget(const ProviderScope(child: RuedlyApp()));
    await tester.pumpAndSettle();

    expect(find.text('Ruedly'), findsOneWidget);
    expect(find.text('Recomendación'), findsOneWidget);
    expect(find.text('Posicionamiento'), findsOneWidget);
  });
}
