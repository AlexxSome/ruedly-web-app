/**
 * Tipos del catálogo de metadatos (factores y valores admitidos).
 *
 * Es la **fuente única** que consumen los clientes (web y móvil) para construir
 * sus formularios dinámicamente. El modelo está pensado para ser extensible:
 * añadir un valor nuevo a un factor, o un factor nuevo, no requiere cambios de
 * código en los clientes (sólo datos), y `version` permite evolucionar el
 * contrato de forma controlada.
 */

/** Flujos de la aplicación donde se usa un factor. */
export type FactorFlow = 'recommendation' | 'positioning';

/** Tipo de control/dato de un factor. */
export type FactorType = 'enum' | 'radio' | 'number';

/** Una opción seleccionable de un factor de tipo `enum`/`radio`. */
export interface FactorOption {
  /** Valor que se envía a la API (clave estable, no traducir). */
  value: string | number;
  /** Etiqueta legible para mostrar en la UI. */
  label: string;
  /** Descripción larga (p. ej. tarjetas de configuración del set). */
  description?: string;
  advantages?: string[];
  disadvantages?: string[];
}

/** Definición de un factor que afecta a la elección de ruedas. */
export interface Factor {
  /** Clave estable usada en los payloads (p. ej. `disciplina`). */
  key: string;
  /** Etiqueta legible. */
  label: string;
  type: FactorType;
  required: boolean;
  /** Flujos que usan este factor. */
  appliesTo: FactorFlow[];
  /** Peso en el scoring de recomendación (informativo/transparencia). */
  scoreWeight?: number;
  /** Opciones para `enum`/`radio`. */
  options?: FactorOption[];
  /** Valor mínimo para `number`. */
  min?: number;
  /** Valor por defecto sugerido. */
  default?: string | number;
  /** Unidad de medida (p. ej. `kg`, `mm`). */
  unit?: string;
}

/** Pesos del scoring de recomendación, por clave de factor. */
export type ScoreWeights = Record<string, number>;

/** Configuración del flujo de posicionamiento. */
export interface PositioningMeta {
  /** Número exacto de ruedas requerido. */
  totalWheels: number;
  /** Clave del factor con las durezas disponibles. */
  hardnessFactorKey: string;
}

/** Catálogo completo de metadatos. */
export interface Metadata {
  /** Versión del contrato de metadatos. */
  version: string;
  scoreWeights: ScoreWeights;
  factors: Factor[];
  positioning: PositioningMeta;
}
