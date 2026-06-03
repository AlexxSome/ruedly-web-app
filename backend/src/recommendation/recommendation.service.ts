import { Injectable } from '@nestjs/common';
import rulesMixedJson from './data/wheel-rules-mixed.json';
import rulesSingleJson from './data/wheel-rules-single.json';
import {
  MixedConfig,
  Recommendation,
  RecommendationForm,
  RecommendationResult,
  Rule,
} from './recommendation.types';

const rulesMixed = rulesMixedJson as Rule[];
const rulesSingle = rulesSingleJson as Rule[];

const NUMERIC_MODE = 'numérica (82A–90A)';

/**
 * Motor de recomendación de ruedas.
 *
 * Port fiel (1:1) de `frontend/src/utils/wheelRecommendation.js`. La lógica de
 * scoring, fallback y `applySetConfig` se mantiene idéntica para preservar la
 * paridad con el frontend (ver tests). La persistencia de reglas en base de
 * datos se aborda en otro issue (#6); aquí se cargan desde JSON empaquetado.
 */
@Injectable()
export class RecommendationService {
  getRecommendation(form: RecommendationForm): RecommendationResult {
    // Validación básica de campos requeridos.
    if (
      !form.disciplina ||
      !form.pesoKg ||
      !form.edad ||
      !form.experiencia ||
      !form.estilo ||
      !form.suelo ||
      !form.priority ||
      !form.modoDureza ||
      !form.wheelSize ||
      !form.setConfigMode
    ) {
      return {
        error: 'Por favor completa todos los campos requeridos.',
        recommendation: null,
      };
    }

    const isNumeric = form.modoDureza === NUMERIC_MODE;
    const rules: Rule[] = isNumeric
      ? [
          ...rulesMixed.filter((r) => r.mode === 'numeric'),
          ...rulesSingle.filter((r) => r.mode === 'numeric'),
        ]
      : [
          ...rulesMixed.filter((r) => r.mode === 'standard'),
          ...rulesSingle.filter((r) => r.mode === 'standard'),
        ];

    // Buscar la mejor coincidencia.
    let bestMatch: Rule | null = null;
    let bestScore = -1;

    for (const rule of rules) {
      if (form.setConfigMode === 'Automática según la regla') {
        // Sólo reglas con configuración mixta.
        if (rule.recommendation.mixedConfig) {
          const score = this.calculateMatchScore(rule, form);
          if (score > bestScore) {
            bestScore = score;
            bestMatch = rule;
          }
        }
      } else if (form.setConfigMode === 'Dureza única en todo el set') {
        // Sólo reglas sin configuración mixta.
        if (!rule.recommendation.mixedConfig) {
          const score = this.calculateMatchScore(rule, form);
          if (score > bestScore) {
            bestScore = score;
            bestMatch = rule;
          }
        }
      } else {
        // Configuraciones mixtas personalizadas: cualquier regla.
        const score = this.calculateMatchScore(rule, form);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = rule;
        }
      }
    }

    // Sin coincidencia suficiente -> fallback.
    if (!bestMatch || bestScore < 10) {
      const fallback = this.getDefaultRecommendation(form);
      const finalRecommendation = this.applySetConfig(fallback, form);
      return {
        recommendation: {
          ...finalRecommendation,
          wheelSize: form.wheelSize,
        },
        matchScore: 0,
        isFallback: true,
      };
    }

    const recommendation = this.applySetConfig(bestMatch.recommendation, form);

    return {
      recommendation: {
        ...recommendation,
        wheelSize: form.wheelSize,
        profile: recommendation.profile,
      },
      matchScore: bestScore,
      isFallback: false,
      ruleId: bestMatch.id,
    };
  }

  private isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  private isInArray(value: string, array: string[]): boolean {
    return array.includes(value);
  }

  private normalizeTemperature(temp: string): string {
    if (!temp || temp === 'sin especificar') {
      return 'sin especificar';
    }
    return temp;
  }

  /** Calcula el score de coincidencia de una regla (-1 si descarta). */
  private calculateMatchScore(rule: Rule, form: RecommendationForm): number {
    let score = 0;
    const conditions = rule.conditions;

    // Disciplina (obligatorio).
    if (this.isInArray(form.disciplina, conditions.disciplina)) {
      score += 10;
    } else {
      return -1;
    }

    if (
      this.isInRange(
        form.pesoKg,
        conditions.rangoPesoKg.min,
        conditions.rangoPesoKg.max,
      )
    ) {
      score += 5;
    }

    if (
      this.isInRange(
        form.edad,
        conditions.rangoEdad.min,
        conditions.rangoEdad.max,
      )
    ) {
      score += 5;
    }

    if (this.isInArray(form.experiencia, conditions.experiencia)) {
      score += 5;
    }

    if (this.isInArray(form.estilo, conditions.estilo)) {
      score += 5;
    }

    if (this.isInArray(form.suelo, conditions.suelo)) {
      score += 5;
    }

    const normalizedTemp = this.normalizeTemperature(form.temperatura);
    if (this.isInArray(normalizedTemp, conditions.temperatura)) {
      score += 3;
    }

    if (this.isInArray(form.priority, conditions.priority)) {
      score += 5;
    }

    return score;
  }

  /** Recomendación por defecto (fallback). */
  private getDefaultRecommendation(form: RecommendationForm): Recommendation {
    const isNumeric = form.modoDureza === NUMERIC_MODE;

    let hardness: string;
    const profile = 'Elíptico';

    if (isNumeric) {
      if (form.priority === 'Más agarre') {
        hardness = '84A';
      } else if (form.priority === 'Más velocidad') {
        hardness = '87A';
      } else {
        hardness = '85A';
      }
    } else {
      if (form.priority === 'Más agarre') {
        hardness = 'Firm';
      } else if (form.priority === 'Más velocidad') {
        hardness = 'XFirm';
      } else {
        hardness = 'XFirm';
      }
    }

    return {
      hardness,
      profile,
      notes: 'Recomendación general basada en tus preferencias.',
      mixedConfig: null,
      isFallback: true,
    };
  }

  /** Aplica la configuración del set según `setConfigMode`. */
  private applySetConfig(
    recommendation: Recommendation,
    form: RecommendationForm,
  ): Recommendation {
    const { setConfigMode } = form;

    if (setConfigMode === 'Automática según la regla') {
      return recommendation;
    }

    if (setConfigMode === 'Dureza única en todo el set') {
      return {
        ...recommendation,
        mixedConfig: null,
        notes: `${recommendation.notes} Configuración simplificada: todas las ruedas con dureza ${recommendation.hardness}.`,
      };
    }

    if (setConfigMode === 'Mixto: más agarre delante, más velocidad atrás') {
      const isNumeric = form.modoDureza === NUMERIC_MODE;
      const baseHardness = recommendation.hardness;

      if (isNumeric) {
        const hardnessNum = parseInt(baseHardness.replace('A', ''), 10);
        const frontHardness = Math.max(82, hardnessNum - 1);
        const backHardness = Math.min(90, hardnessNum + 1);

        const positions: Record<string, string> = {
          '1': `${frontHardness}A`,
          '2': `${frontHardness}A`,
          '3': `${backHardness}A`,
          '4': `${backHardness}A`,
        };

        return {
          ...recommendation,
          mixedConfig: {
            positions,
            description:
              'Delante más blando para agarre; atrás más duro para velocidad.',
          },
          notes: `${recommendation.notes} Configuración mixta: más agarre delante, más velocidad atrás.`,
        };
      }

      const hardnessMap: Record<string, { front: string; back: string }> = {
        Firm: { front: 'Firm', back: 'XFirm' },
        XFirm: { front: 'Firm', back: 'XFirm' },
        XXFirm: { front: 'XFirm', back: 'XXFirm' },
      };

      const mapping = hardnessMap[baseHardness] || {
        front: 'Firm',
        back: 'XFirm',
      };

      const positions: Record<string, string> = {
        '1': mapping.front,
        '2': mapping.front,
        '3': mapping.back,
        '4': mapping.back,
      };

      return {
        ...recommendation,
        mixedConfig: {
          positions,
          description:
            'Delante más blando para agarre; atrás más duro para velocidad.',
        },
        notes: `${recommendation.notes} Configuración mixta: más agarre delante, más velocidad atrás.`,
      };
    }

    if (setConfigMode === 'Mixto: configuración de control y agarre') {
      const isNumeric = form.modoDureza === NUMERIC_MODE;
      const baseHardness = recommendation.hardness;

      if (isNumeric) {
        const hardnessNum = parseInt(baseHardness.replace('A', ''), 10);
        const softerHardness = Math.max(82, hardnessNum - 1);

        const positions: Record<string, string> = {
          '1': `${softerHardness}A`,
          '2': `${softerHardness}A`,
          '3': `${softerHardness}A`,
          '4': `${baseHardness}`,
        };

        return {
          ...recommendation,
          mixedConfig: {
            positions,
            description:
              'Configuración balanceada para máximo control y agarre en todas las posiciones.',
          },
          notes: `${recommendation.notes} Configuración orientada a control y agarre.`,
        };
      }

      const positions: Record<string, string> = {
        '1': 'Firm',
        '2': 'Firm',
        '3': 'Firm',
        '4': 'XFirm',
      };

      return {
        ...recommendation,
        mixedConfig: {
          positions,
          description: 'Configuración balanceada para máximo control y agarre.',
        } as MixedConfig,
        notes: `${recommendation.notes} Configuración orientada a control y agarre.`,
      };
    }

    return recommendation;
  }
}
