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
 * Determina la estrategia de posicionamiento basada en los datos del usuario
 */
function determinePositioningStrategy(userData) {
  const { disciplina, estilo, suelo, temperatura, priority, experiencia, pesoKg } = userData;
  
  let strategy = {
    frontBias: 0.5, // 0 = más duras delante, 1 = más blandas delante (default 0.5 = balance)
    speedBias: 0.5, // 0 = más agarre, 1 = más velocidad
    description: ''
  };

  // Prioridad del usuario
  if (priority === 'Más agarre') {
    strategy.frontBias = 0.7; // Más blandas delante
    strategy.speedBias = 0.2;
  } else if (priority === 'Más velocidad') {
    strategy.frontBias = 0.3; // Más duras delante (menos agarre, más velocidad)
    strategy.speedBias = 0.8;
  } else {
    strategy.frontBias = 0.5;
    strategy.speedBias = 0.5;
  }

  // Ajustes por disciplina
  if (disciplina === 'velocidad') {
    strategy.speedBias += 0.2;
    strategy.frontBias -= 0.1; // Más duras delante para velocidad
  } else if (disciplina === 'fondo') {
    strategy.frontBias += 0.1; // Más blandas delante para comodidad
    strategy.speedBias -= 0.1;
  } else if (disciplina === 'skate cross' || disciplina === 'derrapes' || disciplina === 'free style (calle)') {
    strategy.frontBias += 0.2; // Más agarre delante para control
    strategy.speedBias -= 0.2;
  }

  // Ajustes por estilo
  if (estilo === 'explosivo (velocidad)') {
    strategy.speedBias += 0.1;
  } else if (estilo === 'tecnico' || estilo === 'free style') {
    strategy.frontBias += 0.1;
  }

  // Ajustes por suelo
  if (suelo === 'asfalto rugoso' || suelo === 'calle') {
    strategy.frontBias += 0.15; // Más blandas delante para absorber irregularidades
  } else if (suelo === 'pista') {
    strategy.speedBias += 0.1; // Más velocidad en pista
  }

  // Ajustes por temperatura
  if (temperatura === 'frio') {
    strategy.frontBias += 0.1; // Más blandas en frío para mejor agarre
  } else if (temperatura === 'caluroso') {
    strategy.speedBias += 0.1; // Más duras en calor
  }

  // Normalizar valores
  strategy.frontBias = Math.max(0, Math.min(1, strategy.frontBias));
  strategy.speedBias = Math.max(0, Math.min(1, strategy.speedBias));

  // Generar descripción
  const parts = [];
  if (strategy.frontBias > 0.6) {
    parts.push('prioriza agarre delante');
  } else if (strategy.frontBias < 0.4) {
    parts.push('prioriza velocidad delante');
  }
  
  if (strategy.speedBias > 0.6) {
    parts.push('optimizado para velocidad');
  } else if (strategy.speedBias < 0.4) {
    parts.push('optimizado para agarre');
  }

  strategy.description = parts.length > 0 
    ? `Configuración ${parts.join(' y ')} basada en tu perfil.`
    : 'Configuración balanceada basada en tu perfil.';

  return strategy;
}

/**
 * Calcula el posicionamiento de ruedas para ambos pies
 * Estrategia:
 * - Ruedas más blandas delante (posiciones 1-2) para agarre
 * - Ruedas más duras atrás (posiciones 3-4) para velocidad
 * - Balancear entre ambos pies
 * - Considera los datos del usuario para ajustar la estrategia
 */
export function calculateWheelPosition(data) {
  const { wheels: wheelsData, userData } = data;
  
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

  // Determinar estrategia basada en datos del usuario
  const positioningStrategy = determinePositioningStrategy(userData);

  const resultRight = ['', '', '', ''];
  const resultLeft = ['', '', '', ''];

  // Estrategia adaptativa basada en frontBias
  // frontBias alto (>0.5) = más blandas delante
  // frontBias bajo (<0.5) = más duras delante (para velocidad)

  if (positioningStrategy.frontBias >= 0.5) {
    // Estrategia estándar: más blandas delante, más duras atrás
    resultRight[0] = allWheels[0]; // Más blanda
    resultRight[1] = allWheels[2]; // Tercera más blanda
    resultRight[2] = allWheels[5]; // Sexta (más dura del medio)
    resultRight[3] = allWheels[7]; // Más dura

    resultLeft[0] = allWheels[1];  // Segunda más blanda
    resultLeft[1] = allWheels[3];  // Cuarta más blanda
    resultLeft[2] = allWheels[4];  // Quinta (más blanda del medio)
    resultLeft[3] = allWheels[6];  // Séptima (segunda más dura)
  } else {
    // Estrategia para velocidad: más duras delante, más blandas atrás
    // (menos común, pero útil para velocidad pura)
    resultRight[0] = allWheels[6]; // Segunda más dura
    resultRight[1] = allWheels[7]; // Más dura
    resultRight[2] = allWheels[1]; // Segunda más blanda
    resultRight[3] = allWheels[0]; // Más blanda

    resultLeft[0] = allWheels[5];  // Tercera más dura
    resultLeft[1] = allWheels[4];  // Cuarta más dura
    resultLeft[2] = allWheels[2];  // Tercera más blanda
    resultLeft[3] = allWheels[3];  // Cuarta más blanda
  }

  return {
    rightFoot: resultRight,
    leftFoot: resultLeft,
    strategy: positioningStrategy.description,
    userContext: {
      disciplina: userData.disciplina,
      priority: userData.priority,
      estilo: userData.estilo
    }
  };
}
