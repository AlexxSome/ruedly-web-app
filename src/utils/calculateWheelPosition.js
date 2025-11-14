/**
 * Ordena las durezas de más blanda a más dura
 */
function getHardnessOrder(hardness) {
  const order = {
    'Firm': 1,
    'XFirm': 2,
    'XXFirm': 3,
    '82A': 1,
    '83A': 2,
    '84A': 3,
    '85A': 4,
    '86A': 5,
    '87A': 6,
    '88A': 7,
    '89A': 8,
    '90A': 9
  };
  return order[hardness] || 5;
}

/**
 * Compara dos durezas
 */
function compareHardness(a, b) {
  return getHardnessOrder(a) - getHardnessOrder(b);
}

/**
 * Calcula el posicionamiento de ruedas para ambos pies
 * Estrategia:
 * - Ruedas más blandas delante (posiciones 1-2) para agarre
 * - Ruedas más duras atrás (posiciones 3-4) para velocidad
 * - Balancear entre ambos pies
 */
export function calculateWheelPosition(wheelsData) {
  // Validar que hay exactamente 8 ruedas
  const total = wheelsData.reduce((sum, w) => sum + w.quantity, 0);
  if (total !== 8) {
    return {
      error: `Debes tener exactamente 8 ruedas. Total: ${total}`
    };
  }

  // Crear array de todas las ruedas
  const allWheels = [];
  wheelsData.forEach(wheel => {
    for (let i = 0; i < wheel.quantity; i++) {
      allWheels.push(wheel.hardness);
    }
  });

  // Ordenar de más blanda a más dura
  allWheels.sort(compareHardness);

  // Si todas las ruedas son iguales, distribución simple
  if (allWheels.every(w => w === allWheels[0])) {
    const hardness = allWheels[0];
    return {
      rightFoot: [hardness, hardness, hardness, hardness],
      leftFoot: [hardness, hardness, hardness, hardness],
      strategy: 'Todas las ruedas son iguales, distribución uniforme'
    };
  }

  // Estrategia de distribución:
  // - Posiciones 1-2 (delante): las 4 más blandas
  // - Posiciones 3-4 (atrás): las 4 más duras
  // - Balancear entre ambos pies

  const resultRight = ['', '', '', ''];
  const resultLeft = ['', '', '', ''];

  // Pie derecho: más blanda delante, más dura atrás
  resultRight[0] = allWheels[0]; // Más blanda
  resultRight[1] = allWheels[2]; // Tercera más blanda
  resultRight[2] = allWheels[5]; // Sexta (más dura del medio)
  resultRight[3] = allWheels[7]; // Más dura

  // Pie izquierdo: balancear con el derecho
  resultLeft[0] = allWheels[1];  // Segunda más blanda
  resultLeft[1] = allWheels[3];  // Cuarta más blanda
  resultLeft[2] = allWheels[4];   // Quinta (más blanda del medio)
  resultLeft[3] = allWheels[6];  // Séptima (segunda más dura)

  return {
    rightFoot: resultRight,
    leftFoot: resultLeft,
    strategy: 'Ruedas más blandas delante (posiciones 1-2) para agarre, más duras atrás (posiciones 3-4) para velocidad'
  };
}
