/**
 * Tipos del dominio de posicionamiento de ruedas.
 * Reflejan el contrato de `frontend/src/utils/calculateWheelPosition.js`.
 */

export interface WheelInput {
  hardness: string;
  quantity: number;
}

export interface PositioningUserData {
  disciplina: string;
  pesoKg: number;
  experiencia: string;
  estilo: string;
  suelo: string;
  temperatura: string;
  priority: string;
}

export interface PositioningInput {
  wheels: WheelInput[];
  userData: PositioningUserData;
}

export interface PositioningStrategy {
  frontBias: number;
  speedBias: number;
  description: string;
}

export interface PositioningResult {
  rightFoot?: string[];
  leftFoot?: string[];
  strategy?: string;
  userContext?: {
    disciplina: string;
    priority: string;
    estilo: string;
  };
  /** Mensaje de error cuando el total de ruedas no es 8. */
  error?: string;
}
