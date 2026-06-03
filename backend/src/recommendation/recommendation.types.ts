/**
 * Tipos del dominio de recomendación de ruedas.
 *
 * Reflejan el contrato del motor original del frontend
 * (`frontend/src/utils/wheelRecommendation.js`). Se tipan los valores
 * conocidos pero se mantienen permisivos donde el motor acepta strings
 * libres provenientes de los formularios.
 */

export type HardnessMode = 'standard' | 'numeric';

/** Modos de configuración del set admitidos por el formulario. */
export type SetConfigMode =
  | 'Automática según la regla'
  | 'Dureza única en todo el set'
  | 'Mixto: más agarre delante, más velocidad atrás'
  | 'Mixto: configuración de control y agarre';

export interface NumericRange {
  min: number;
  max: number;
}

export interface RuleConditions {
  disciplina: string[];
  rangoPesoKg: NumericRange;
  rangoEdad: NumericRange;
  experiencia: string[];
  estilo: string[];
  suelo: string[];
  temperatura: string[];
  priority: string[];
}

export interface MixedConfig {
  positions: Record<string, string>;
  description: string;
}

export interface Recommendation {
  hardness: string;
  profile: string;
  notes: string;
  mixedConfig: MixedConfig | null;
  /** Presente sólo en la recomendación de fallback. */
  isFallback?: boolean;
}

export interface Rule {
  id: string;
  mode: HardnessMode;
  conditions: RuleConditions;
  recommendation: Recommendation;
}

/** Datos del formulario de recomendación. */
export interface RecommendationForm {
  disciplina: string;
  pesoKg: number;
  edad: number;
  experiencia: string;
  estilo: string;
  suelo: string;
  temperatura: string;
  priority: string;
  modoDureza: string;
  wheelSize: number;
  setConfigMode: string;
}

export interface RecommendationResult {
  recommendation: (Recommendation & { wheelSize: number }) | null;
  matchScore?: number;
  isFallback?: boolean;
  ruleId?: string;
  /** Mensaje de error de validación cuando faltan campos. */
  error?: string;
}
