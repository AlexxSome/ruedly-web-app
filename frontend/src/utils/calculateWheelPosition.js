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

  // Agrupar ruedas por dureza y contar cuántas hay de cada tipo
  const wheelsByHardness = {};
  allWheels.forEach(wheel => {
    wheelsByHardness[wheel] = (wheelsByHardness[wheel] || 0) + 1;
  });

  // Obtener durezas ordenadas de más blanda a más dura
  const hardnessTypes = Object.keys(wheelsByHardness).sort(compareHardness);

  const resultRight = ['', '', '', ''];
  const resultLeft = ['', '', '', ''];

  // Arrays para distribuir ruedas: delanteras (0-1) y traseras (2-3) de cada pie
  const rightFront = [];
  const rightBack = [];
  const leftFront = [];
  const leftBack = [];

  // Determinar qué durezas van delante y cuáles atrás
  const frontBias = positioningStrategy.frontBias;
  // Si frontBias es alto (>0.5), más ruedas blandas van delante
  // Si frontBias es bajo (<0.5), más ruedas duras van delante
  let frontHardness, backHardness;
  
  if (frontBias >= 0.5) {
    // Estrategia estándar: más blandas delante
    const splitIndex = Math.max(1, Math.min(
      hardnessTypes.length - 1,
      Math.round(hardnessTypes.length * frontBias)
    ));
    frontHardness = hardnessTypes.slice(0, splitIndex); // Más blandas van delante
    backHardness = hardnessTypes.slice(splitIndex);      // Más duras van atrás
  } else {
    // Estrategia para velocidad: más duras delante
    const splitIndex = Math.max(1, Math.min(
      hardnessTypes.length - 1,
      Math.round(hardnessTypes.length * (1 - frontBias))
    ));
    frontHardness = hardnessTypes.slice(-splitIndex).reverse(); // Más duras van delante
    backHardness = hardnessTypes.slice(0, hardnessTypes.length - splitIndex); // Más blandas van atrás
  }

  // Distribuir cada tipo de dureza equitativamente entre ambos pies
  hardnessTypes.forEach(hardness => {
    const count = wheelsByHardness[hardness];
    const isFront = frontHardness.includes(hardness);

    // Distribuir equitativamente: si hay 2, una en cada pie; si hay 4, 2 en cada pie, etc.
    for (let i = 0; i < count; i++) {
      const goesToRight = i % 2 === 0;
      
      if (isFront) {
        if (goesToRight) {
          rightFront.push(hardness);
        } else {
          leftFront.push(hardness);
        }
      } else {
        if (goesToRight) {
          rightBack.push(hardness);
        } else {
          leftBack.push(hardness);
        }
      }
    }
  });

  // Ordenar dentro de cada grupo para mantener orden de dureza
  rightFront.sort(compareHardness);
  leftFront.sort(compareHardness);
  rightBack.sort(compareHardness);
  leftBack.sort(compareHardness);

  // Asegurar que cada pie tenga 2 delanteras y 2 traseras
  // Si hay desbalance, redistribuir
  const balanceGroups = () => {
    // Si un pie tiene más delanteras de las necesarias, mover a traseras
    while (rightFront.length > 2 && rightBack.length < 2) {
      rightBack.push(rightFront.pop());
    }
    while (leftFront.length > 2 && leftBack.length < 2) {
      leftBack.push(leftFront.pop());
    }
    
    // Si un pie tiene más traseras de las necesarias, mover a delanteras
    while (rightBack.length > 2 && rightFront.length < 2) {
      rightFront.push(rightBack.pop());
    }
    while (leftBack.length > 2 && leftFront.length < 2) {
      leftFront.push(leftBack.pop());
    }

    // Si aún hay desbalance, redistribuir entre pies
    while (rightFront.length + rightBack.length < 4) {
      if (leftFront.length > 2) {
        rightFront.push(leftFront.shift());
      } else if (leftBack.length > 2) {
        rightBack.push(leftBack.shift());
      } else {
        break;
      }
    }

    while (leftFront.length + leftBack.length < 4) {
      if (rightFront.length > 2) {
        leftFront.push(rightFront.shift());
      } else if (rightBack.length > 2) {
        leftBack.push(rightBack.shift());
      } else {
        break;
      }
    }
  };

  balanceGroups();

  // Asignar a las posiciones finales
  // Delanteras: posiciones 0 y 1, Traseras: posiciones 2 y 3
  resultRight[0] = rightFront[0] || '';
  resultRight[1] = rightFront[1] || rightBack[0] || '';
  resultRight[2] = rightBack[0] || rightFront[1] || '';
  resultRight[3] = rightBack[1] || '';

  resultLeft[0] = leftFront[0] || '';
  resultLeft[1] = leftFront[1] || leftBack[0] || '';
  resultLeft[2] = leftBack[0] || leftFront[1] || '';
  resultLeft[3] = leftBack[1] || '';

  // Completar cualquier posición vacía con ruedas restantes
  const allRemaining = [
    ...rightFront.slice(2),
    ...rightBack.slice(2),
    ...leftFront.slice(2),
    ...leftBack.slice(2)
  ].sort(compareHardness);

  let remainingIndex = 0;
  for (let i = 0; i < 4; i++) {
    if (!resultRight[i] && remainingIndex < allRemaining.length) {
      resultRight[i] = allRemaining[remainingIndex++];
    }
    if (!resultLeft[i] && remainingIndex < allRemaining.length) {
      resultLeft[i] = allRemaining[remainingIndex++];
    }
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
