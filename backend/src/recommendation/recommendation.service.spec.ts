import { RecommendationService } from './recommendation.service';
import { RecommendationForm } from './recommendation.types';

/**
 * Tests de paridad: los valores esperados ("golden") se generaron ejecutando el
 * motor original del frontend (`frontend/src/utils/wheelRecommendation.js`,
 * versión de develop) sobre los mismos inputs. El backend debe producir
 * resultados idénticos.
 */
describe('RecommendationService', () => {
  let service: RecommendationService;

  beforeEach(() => {
    service = new RecommendationService();
  });

  it('está definido', () => {
    expect(service).toBeDefined();
  });

  it('valida campos requeridos faltantes', () => {
    const input: RecommendationForm = {
      disciplina: 'velocidad',
      pesoKg: 0,
      edad: 18,
      experiencia: 'principiante',
      estilo: 'mixto',
      suelo: 'pista',
      temperatura: 'templado',
      priority: 'Más agarre',
      modoDureza: 'estándar (Firm/XFirm/XXFirm)',
      wheelSize: 100,
      setConfigMode: 'Dureza única en todo el set',
    };
    expect(service.getRecommendation(input)).toEqual({
      error: 'Por favor completa todos los campos requeridos.',
      recommendation: null,
    });
  });

  it('coincide con una regla de dureza única (paridad)', () => {
    const input: RecommendationForm = {
      disciplina: 'velocidad',
      pesoKg: 60,
      edad: 18,
      experiencia: 'principiante',
      estilo: 'mixto',
      suelo: 'pista',
      temperatura: 'templado',
      priority: 'Más agarre',
      modoDureza: 'estándar (Firm/XFirm/XXFirm)',
      wheelSize: 100,
      setConfigMode: 'Dureza única en todo el set',
    };
    expect(service.getRecommendation(input)).toEqual({
      recommendation: {
        hardness: 'Firm',
        profile: 'Elíptico',
        notes:
          'Firm y perfil elíptico dan mucha seguridad a quienes se inician en velocidad en pista, reduciendo caídas por falta de agarre. Configuración simplificada: todas las ruedas con dureza Firm.',
        mixedConfig: null,
        wheelSize: 100,
      },
      matchScore: 43,
      isFallback: false,
      ruleId: 'velocidad_pista_principiante_Firm_50_70kg',
    });
  });

  it('modo "Automática según la regla" devuelve una regla mixta (paridad)', () => {
    const input: RecommendationForm = {
      disciplina: 'velocidad',
      pesoKg: 70,
      edad: 22,
      experiencia: 'intermedio',
      estilo: 'mixto',
      suelo: 'pista',
      temperatura: 'templado',
      priority: 'Balance entre agarre y velocidad',
      modoDureza: 'estándar (Firm/XFirm/XXFirm)',
      wheelSize: 110,
      setConfigMode: 'Automática según la regla',
    };
    expect(service.getRecommendation(input)).toEqual({
      recommendation: {
        hardness: 'XFirm',
        profile: 'Bullet',
        notes:
          'Configuración mixta para pista fría: más agarre al entrar en curva con Firm delante y mejor salida con XFirm atrás.',
        mixedConfig: {
          positions: { '1': 'Firm', '2': 'Firm', '3': 'XFirm', '4': 'XFirm' },
          description:
            'Firm delante para asegurar la entrada en curva; XFirm atrás para conservar velocidad en la salida.',
        },
        wheelSize: 110,
      },
      matchScore: 35,
      isFallback: false,
      ruleId: 'velocidad_pista_explosivo_frio_mixto_standard_50_80kg',
    });
  });

  it('modo mixto agarre/velocidad (estándar) genera mixedConfig (paridad)', () => {
    const input: RecommendationForm = {
      disciplina: 'fondo',
      pesoKg: 75,
      edad: 30,
      experiencia: 'avanzado',
      estilo: 'fondo',
      suelo: 'asfalto liso',
      temperatura: 'caluroso',
      priority: 'Más velocidad',
      modoDureza: 'estándar (Firm/XFirm/XXFirm)',
      wheelSize: 110,
      setConfigMode: 'Mixto: más agarre delante, más velocidad atrás',
    };
    expect(service.getRecommendation(input)).toEqual({
      recommendation: {
        hardness: 'Firm',
        profile: 'Elíptico',
        notes:
          'Para fondo en pista, un set completo Firm ofrece comodidad, buen agarre en curvas largas y control durante muchos giros. Configuración mixta: más agarre delante, más velocidad atrás.',
        mixedConfig: {
          positions: { '1': 'Firm', '2': 'Firm', '3': 'XFirm', '4': 'XFirm' },
          description:
            'Delante más blando para agarre; atrás más duro para velocidad.',
        },
        wheelSize: 110,
      },
      matchScore: 25,
      isFallback: false,
      ruleId: 'fondo_pista_Firm_50_80kg',
    });
  });

  it('usa fallback con mixto control/agarre numérico cuando no hay regla (paridad)', () => {
    const input: RecommendationForm = {
      disciplina: 'free style (calle)',
      pesoKg: 65,
      edad: 20,
      experiencia: 'intermedio',
      estilo: 'free style',
      suelo: 'calle',
      temperatura: 'frio',
      priority: 'Más agarre',
      modoDureza: 'numérica (82A–90A)',
      wheelSize: 80,
      setConfigMode: 'Mixto: configuración de control y agarre',
    };
    expect(service.getRecommendation(input)).toEqual({
      recommendation: {
        hardness: '84A',
        profile: 'Elíptico',
        notes:
          'Recomendación general basada en tus preferencias. Configuración orientada a control y agarre.',
        mixedConfig: {
          positions: { '1': '83A', '2': '83A', '3': '83A', '4': '84A' },
          description:
            'Configuración balanceada para máximo control y agarre en todas las posiciones.',
        },
        isFallback: true,
        wheelSize: 80,
      },
      matchScore: 0,
      isFallback: true,
    });
  });
});
