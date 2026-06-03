import rulesMixed from "../data/wheelRulesMixed.json";
import rulesSingle from "../data/wheelRulesSingle.json";

/**
 * Verifica si un valor está dentro de un rango
 */
function isInRange(value, min, max) {
  return value >= min && value <= max;
}

/**
 * Verifica si un valor está en un array
 */
function isInArray(value, array) {
  return array.includes(value);
}

/**
 * Normaliza la temperatura para comparación
 */
function normalizeTemperature(temp) {
  if (!temp || temp === "sin especificar") {
    return "sin especificar";
  }
  return temp;
}

/**
 * Calcula el score de coincidencia de una regla
 */
function calculateMatchScore(rule, form) {
  let score = 0;
  const conditions = rule.conditions;

  // Disciplina (obligatorio)
  if (isInArray(form.disciplina, conditions.disciplina)) {
    score += 10;
  } else {
    return -1; // Si no coincide la disciplina, descartar
  }

  // Peso
  if (isInRange(form.pesoKg, conditions.rangoPesoKg.min, conditions.rangoPesoKg.max)) {
    score += 5;
  }

  // Edad
  if (isInRange(form.edad, conditions.rangoEdad.min, conditions.rangoEdad.max)) {
    score += 5;
  }

  // Experiencia
  if (isInArray(form.experiencia, conditions.experiencia)) {
    score += 5;
  }

  // Estilo
  if (isInArray(form.estilo, conditions.estilo)) {
    score += 5;
  }

  // Suelo
  if (isInArray(form.suelo, conditions.suelo)) {
    score += 5;
  }

  // Temperatura
  const normalizedTemp = normalizeTemperature(form.temperatura);
  if (isInArray(normalizedTemp, conditions.temperatura)) {
    score += 3;
  }

  // Priority
  if (isInArray(form.priority, conditions.priority)) {
    score += 5;
  }

  return score;
}

/**
 * Genera una recomendación por defecto (fallback)
 */
function getDefaultRecommendation(form) {
  const isNumeric = form.modoDureza === "numérica (82A–90A)";
  
  // Lógica básica de fallback
  let hardness, profile;
  
  if (isNumeric) {
    if (form.priority === "Más agarre") {
      hardness = "84A";
    } else if (form.priority === "Más velocidad") {
      hardness = "87A";
    } else {
      hardness = "85A";
    }
    profile = "Elíptico";
  } else {
    if (form.priority === "Más agarre") {
      hardness = "Firm";
    } else if (form.priority === "Más velocidad") {
      hardness = "XFirm";
    } else {
      hardness = "XFirm";
    }
    profile = "Elíptico";
  }

  return {
    hardness,
    profile,
    notes: "Recomendación general basada en tus preferencias.",
    mixedConfig: null,
    isFallback: true
  };
}

/**
 * Aplica la configuración del set según setConfigMode
 */
function applySetConfig(recommendation, form, originalRule) {
  const { setConfigMode } = form;

  // Si es "Automática según la regla", usar la recomendación tal cual
  if (setConfigMode === "Automática según la regla") {
    return recommendation;
  }

  // Si es "Dureza única en todo el set", ignorar mixedConfig
  if (setConfigMode === "Dureza única en todo el set") {
    return {
      ...recommendation,
      mixedConfig: null,
      notes: `${recommendation.notes} Configuración simplificada: todas las ruedas con dureza ${recommendation.hardness}.`
    };
  }

  // Si es "Mixto: más agarre delante, más velocidad atrás"
  if (setConfigMode === "Mixto: más agarre delante, más velocidad atrás") {
    const isNumeric = form.modoDureza === "numérica (82A–90A)";
    const baseHardness = recommendation.hardness;
    
    if (isNumeric) {
      // Convertir dureza numérica a número
      const hardnessNum = parseInt(baseHardness.replace("A", ""));
      const frontHardness = Math.max(82, hardnessNum - 1);
      const backHardness = Math.min(90, hardnessNum + 1);
      
      return {
        ...recommendation,
        mixedConfig: {
          positions: {
            "1": `${frontHardness}A`,
            "2": `${frontHardness}A`,
            "3": `${backHardness}A`,
            "4": `${backHardness}A`
          },
          description: "Delante más blando para agarre; atrás más duro para velocidad."
        },
        notes: `${recommendation.notes} Configuración mixta: más agarre delante, más velocidad atrás.`
      };
    } else {
      // Modo estándar
      const hardnessMap = {
        "Firm": { front: "Firm", back: "XFirm" },
        "XFirm": { front: "Firm", back: "XFirm" },
        "XXFirm": { front: "XFirm", back: "XXFirm" }
      };
      
      const mapping = hardnessMap[baseHardness] || { front: "Firm", back: "XFirm" };
      
      return {
        ...recommendation,
        mixedConfig: {
          positions: {
            "1": mapping.front,
            "2": mapping.front,
            "3": mapping.back,
            "4": mapping.back
          },
          description: "Delante más blando para agarre; atrás más duro para velocidad."
        },
        notes: `${recommendation.notes} Configuración mixta: más agarre delante, más velocidad atrás.`
      };
    }
  }

  // Si es "Mixto: configuración de control y agarre"
  if (setConfigMode === "Mixto: configuración de control y agarre") {
    const isNumeric = form.modoDureza === "numérica (82A–90A)";
    const baseHardness = recommendation.hardness;
    
    if (isNumeric) {
      const hardnessNum = parseInt(baseHardness.replace("A", ""));
      const softerHardness = Math.max(82, hardnessNum - 1);
      
      return {
        ...recommendation,
        mixedConfig: {
          positions: {
            "1": `${softerHardness}A`,
            "2": `${softerHardness}A`,
            "3": `${softerHardness}A`,
            "4": `${baseHardness}`
          },
          description: "Configuración balanceada para máximo control y agarre en todas las posiciones."
        },
        notes: `${recommendation.notes} Configuración orientada a control y agarre.`
      };
    } else {
      return {
        ...recommendation,
        mixedConfig: {
          positions: {
            "1": "Firm",
            "2": "Firm",
            "3": "Firm",
            "4": "XFirm"
          },
          description: "Configuración balanceada para máximo control y agarre."
        },
        notes: `${recommendation.notes} Configuración orientada a control y agarre.`
      };
    }
  }

  return recommendation;
}

/**
 * Función principal para obtener recomendación de ruedas
 */
export function getWheelRecommendation(form) {
  // Validación básica
  if (!form.disciplina || !form.pesoKg || !form.edad || !form.experiencia || 
      !form.estilo || !form.suelo || !form.priority || !form.modoDureza || 
      !form.wheelSize || !form.setConfigMode) {
    return {
      error: "Por favor completa todos los campos requeridos.",
      recommendation: null
    };
  }

  const isNumeric = form.modoDureza === "numérica (82A–90A)";
  const rules = isNumeric 
    ? [...rulesMixed.filter(r => r.mode === "numeric"), ...rulesSingle.filter(r => r.mode === "numeric")]
    : [...rulesMixed.filter(r => r.mode === "standard"), ...rulesSingle.filter(r => r.mode === "standard")];

  // Buscar la mejor coincidencia
  let bestMatch = null;
  let bestScore = -1;

  for (const rule of rules) {
    // Filtrar según setConfigMode si es necesario
    if (form.setConfigMode === "Automática según la regla") {
      // Buscar en rulesMixed primero si hay mixedConfig
      if (rule.recommendation.mixedConfig) {
        const score = calculateMatchScore(rule, form);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = rule;
        }
      }
    } else if (form.setConfigMode === "Dureza única en todo el set") {
      // Buscar en rulesSingle (sin mixedConfig)
      if (!rule.recommendation.mixedConfig) {
        const score = calculateMatchScore(rule, form);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = rule;
        }
      }
    } else {
      // Para configuraciones mixtas personalizadas, buscar cualquier regla
      const score = calculateMatchScore(rule, form);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = rule;
      }
    }
  }

  // Si no hay coincidencia, usar fallback
  if (!bestMatch || bestScore < 10) {
    const fallback = getDefaultRecommendation(form);
    const finalRecommendation = applySetConfig(fallback, form, null);
    return {
      recommendation: {
        ...finalRecommendation,
        wheelSize: form.wheelSize
      },
      matchScore: 0,
      isFallback: true
    };
  }

  // Aplicar configuración del set
  const recommendation = applySetConfig(
    bestMatch.recommendation,
    form,
    bestMatch
  );

  return {
    recommendation: {
      ...recommendation,
      wheelSize: form.wheelSize,
      profile: recommendation.profile
    },
    matchScore: bestScore,
    isFallback: false,
    ruleId: bestMatch.id
  };
}

