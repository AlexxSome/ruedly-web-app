import { Factor, Metadata, ScoreWeights } from './metadata.types';

/**
 * Catálogo canónico de factores y valores admitidos.
 *
 * Los `value` son las claves estables que espera el motor (no se traducen) y
 * coinciden 1:1 con las opciones del frontend y con las `conditions` de las
 * reglas. Las `label` son textos para la UI.
 */

const DISCIPLINA: Factor = {
  key: 'disciplina',
  label: 'Disciplina',
  type: 'enum',
  required: true,
  appliesTo: ['recommendation', 'positioning'],
  scoreWeight: 10,
  options: [
    { value: 'velocidad', label: 'Velocidad' },
    { value: 'fondo', label: 'Fondo' },
    { value: 'skate cross', label: 'Skate Cross' },
    { value: 'derrapes', label: 'Derrapes' },
    { value: 'free style (calle)', label: 'Free Style (Calle)' },
  ],
};

const PESO_KG: Factor = {
  key: 'pesoKg',
  label: 'Peso',
  type: 'number',
  required: true,
  appliesTo: ['recommendation', 'positioning'],
  scoreWeight: 5,
  min: 1,
  unit: 'kg',
};

const EDAD: Factor = {
  key: 'edad',
  label: 'Edad',
  type: 'number',
  required: true,
  appliesTo: ['recommendation'],
  scoreWeight: 5,
  min: 1,
};

const EXPERIENCIA: Factor = {
  key: 'experiencia',
  label: 'Experiencia',
  type: 'enum',
  required: true,
  appliesTo: ['recommendation', 'positioning'],
  scoreWeight: 5,
  options: [
    { value: 'principiante', label: 'Principiante' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'avanzado', label: 'Avanzado' },
    { value: 'alta competencia', label: 'Alta Competencia' },
    { value: 'alto rendimiento', label: 'Alto Rendimiento' },
  ],
};

const ESTILO: Factor = {
  key: 'estilo',
  label: 'Estilo',
  type: 'enum',
  required: true,
  appliesTo: ['recommendation', 'positioning'],
  scoreWeight: 5,
  options: [
    { value: 'explosivo (velocidad)', label: 'Explosivo (velocidad)' },
    { value: 'fondo', label: 'Fondo' },
    { value: 'mixto', label: 'Mixto' },
    { value: 'tecnico', label: 'Técnico' },
    { value: 'free style', label: 'Free Style' },
  ],
};

const SUELO: Factor = {
  key: 'suelo',
  label: 'Tipo de Suelo',
  type: 'enum',
  required: true,
  appliesTo: ['recommendation', 'positioning'],
  scoreWeight: 5,
  options: [
    { value: 'pista', label: 'Pista' },
    { value: 'asfalto liso', label: 'Asfalto Liso' },
    { value: 'asfalto rugoso', label: 'Asfalto Rugoso' },
    { value: 'indoor', label: 'Indoor / Cemento liso' },
    { value: 'calle', label: 'Calle' },
  ],
};

const TEMPERATURA: Factor = {
  key: 'temperatura',
  label: 'Temperatura',
  type: 'enum',
  required: false,
  appliesTo: ['recommendation', 'positioning'],
  scoreWeight: 3,
  default: 'sin especificar',
  options: [
    { value: 'sin especificar', label: 'Sin especificar' },
    { value: 'frio', label: 'Frío' },
    { value: 'templado', label: 'Templado' },
    { value: 'caluroso', label: 'Caluroso' },
  ],
};

const PRIORITY: Factor = {
  key: 'priority',
  label: '¿Qué priorizas?',
  type: 'radio',
  required: true,
  appliesTo: ['recommendation', 'positioning'],
  scoreWeight: 5,
  options: [
    { value: 'Más agarre', label: 'Más agarre' },
    { value: 'Más velocidad', label: 'Más velocidad' },
    { value: 'Balance entre agarre y velocidad', label: 'Balance' },
  ],
};

const MODO_DUREZA: Factor = {
  key: 'modoDureza',
  label: 'Cómo está escrita la dureza en tus ruedas',
  type: 'radio',
  required: true,
  appliesTo: ['recommendation'],
  options: [
    { value: 'numérica (82A–90A)', label: 'Numérica (82A–90A)' },
    {
      value: 'estándar (Firm/XFirm/XXFirm)',
      label: 'Estándar (Firm/XFirm/XXFirm)',
    },
  ],
};

const WHEEL_SIZE: Factor = {
  key: 'wheelSize',
  label: 'Tamaño de Ruedas',
  type: 'enum',
  required: true,
  appliesTo: ['recommendation'],
  unit: 'mm',
  options: [
    { value: 80, label: '80' },
    { value: 84, label: '84' },
    { value: 90, label: '90' },
    { value: 100, label: '100' },
    { value: 110, label: '110' },
    { value: 125, label: '125' },
  ],
};

const SET_CONFIG_MODE: Factor = {
  key: 'setConfigMode',
  label: 'Configuración del set',
  type: 'enum',
  required: true,
  appliesTo: ['recommendation'],
  options: [
    {
      value: 'Automática según la regla',
      label: 'Automática',
      description:
        "Usa la configuración pensada para ese escenario (por ejemplo mixedConfig con posiciones 1–4). No requiere conocimientos técnicos, es el modo más 'inteligente'.",
      advantages: [
        'Configuración optimizada para tu escenario',
        'No requiere conocimientos técnicos',
      ],
      disadvantages: [
        'Menos control manual',
        'Puede sugerir configuraciones mixtas más complejas',
      ],
    },
    {
      value: 'Dureza única en todo el set',
      label: 'Dureza única en todo el set',
      description:
        'Usa una sola dureza para las 4 ruedas (la de la recomendación base).',
      advantages: [
        'Comportamiento muy predecible',
        'Fácil de rotar y mantener',
        'Ideal para principiantes',
      ],
      disadvantages: [
        'Menos optimizado para situaciones específicas',
        'Puede perder agarre o velocidad en extremos',
      ],
    },
    {
      value: 'Mixto: más agarre delante, más velocidad atrás',
      label: 'Mixto: más agarre delante, más velocidad atrás',
      description:
        'Ruedas delanteras ligeramente más blandas, ruedas traseras ligeramente más duras.',
      advantages: [
        'Entrada a la curva más segura',
        'Mejor conservación de velocidad en rectas',
        'Útil en velocidad pista y fondo',
      ],
      disadvantages: [
        'Configuración más compleja de entender/rotar',
        'Puede sentirse inestable al principio',
      ],
    },
    {
      value: 'Mixto: configuración de control y agarre',
      label: 'Mixto: configuración de control y agarre',
      description:
        'Mantiene durezas más bien blandas o balanceadas en todas las posiciones, con una ligera variación si hace falta.',
      advantages: [
        'Mucho control en frenadas y trucos',
        'Mejor absorción de irregularidades',
        'Ideal para free style y skate cross',
      ],
      disadvantages: [
        'No es la opción más rápida para rectas largas',
        'Mayor desgaste en escenarios abrasivos',
      ],
    },
  ],
};

/** Durezas disponibles para el formulario de posicionamiento. */
const WHEEL_HARDNESS: Factor = {
  key: 'wheelHardness',
  label: 'Dureza',
  type: 'enum',
  required: true,
  appliesTo: ['positioning'],
  options: [
    { value: 'Firm', label: 'Firm' },
    { value: 'XFirm', label: 'XFirm' },
    { value: 'XXFirm', label: 'XXFirm' },
    { value: '82A', label: '82A' },
    { value: '83A', label: '83A' },
    { value: '84A', label: '84A' },
    { value: '85A', label: '85A' },
    { value: '86A', label: '86A' },
    { value: '87A', label: '87A' },
    { value: '88A', label: '88A' },
    { value: '89A', label: '89A' },
    { value: '90A', label: '90A' },
  ],
};

const FACTORS: Factor[] = [
  DISCIPLINA,
  PESO_KG,
  EDAD,
  EXPERIENCIA,
  ESTILO,
  SUELO,
  TEMPERATURA,
  PRIORITY,
  MODO_DUREZA,
  WHEEL_SIZE,
  SET_CONFIG_MODE,
  WHEEL_HARDNESS,
];

const SCORE_WEIGHTS: ScoreWeights = {
  disciplina: 10,
  pesoKg: 5,
  edad: 5,
  experiencia: 5,
  estilo: 5,
  suelo: 5,
  priority: 5,
  temperatura: 3,
};

export const METADATA: Metadata = {
  version: '1',
  scoreWeights: SCORE_WEIGHTS,
  factors: FACTORS,
  positioning: {
    totalWheels: 8,
    hardnessFactorKey: 'wheelHardness',
  },
};

/**
 * Valores admitidos de un factor, para reutilizar en la validación de DTOs y
 * mantenerla sincronizada con el catálogo de `/metadata`.
 */
export function allowedValues(key: string): (string | number)[] {
  const factor = METADATA.factors.find((f) => f.key === key);
  return (factor?.options ?? []).map((o) => o.value);
}
