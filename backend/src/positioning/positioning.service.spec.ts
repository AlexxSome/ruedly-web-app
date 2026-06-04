import { PositioningService } from './positioning.service';
import { PositioningInput, PositioningUserData } from './positioning.types';

/**
 * Tests de paridad: los valores esperados ("golden") se generaron ejecutando el
 * motor original del frontend (`frontend/src/utils/calculateWheelPosition.js`,
 * versión de develop) sobre los mismos inputs.
 */
describe('PositioningService', () => {
  let service: PositioningService;

  const baseUser: PositioningUserData = {
    disciplina: 'velocidad',
    pesoKg: 70,
    experiencia: 'intermedio',
    estilo: 'mixto',
    suelo: 'pista',
    temperatura: 'templado',
    priority: 'Balance entre agarre y velocidad',
  };

  beforeEach(() => {
    service = new PositioningService();
  });

  it('está definido', () => {
    expect(service).toBeDefined();
  });

  it('devuelve error si el total no es 8 ruedas', () => {
    const input: PositioningInput = {
      wheels: [{ hardness: '85A', quantity: 6 }],
      userData: baseUser,
    };
    expect(service.calculateWheelPosition(input)).toEqual({
      error: 'Debes tener exactamente 8 ruedas. Total: 6',
    });
  });

  it('distribuye uniformemente cuando todas las ruedas son iguales (paridad)', () => {
    const input: PositioningInput = {
      wheels: [{ hardness: '85A', quantity: 8 }],
      userData: baseUser,
    };
    expect(service.calculateWheelPosition(input)).toEqual({
      rightFoot: ['85A', '85A', '85A', '85A'],
      leftFoot: ['85A', '85A', '85A', '85A'],
      strategy: 'Todas las ruedas son iguales, distribución uniforme',
    });
  });

  it('set mixto estándar priorizando agarre (paridad)', () => {
    const input: PositioningInput = {
      wheels: [
        { hardness: 'Firm', quantity: 4 },
        { hardness: 'XFirm', quantity: 4 },
      ],
      userData: { ...baseUser, priority: 'Más agarre', disciplina: 'fondo' },
    };
    expect(service.calculateWheelPosition(input)).toEqual({
      rightFoot: ['Firm', 'Firm', 'XFirm', 'XFirm'],
      leftFoot: ['Firm', 'Firm', 'XFirm', 'XFirm'],
      strategy:
        'Configuración prioriza agarre delante y optimizado para agarre basada en tu perfil.',
      userContext: {
        disciplina: 'fondo',
        priority: 'Más agarre',
        estilo: 'mixto',
      },
    });
  });

  /** Cuenta de cada dureza en una lista (multiset). */
  const tally = (arr: string[]): Record<string, number> =>
    arr.reduce<Record<string, number>>((acc, h) => {
      acc[h] = (acc[h] || 0) + 1;
      return acc;
    }, {});

  it('cubre ajustes de estrategia por disciplina/estilo/suelo/temperatura', () => {
    const result = service.calculateWheelPosition({
      wheels: [
        { hardness: 'Firm', quantity: 4 },
        { hardness: 'XFirm', quantity: 4 },
      ],
      userData: {
        disciplina: 'fondo',
        pesoKg: 68,
        experiencia: 'avanzado',
        estilo: 'tecnico',
        suelo: 'asfalto rugoso',
        temperatura: 'frio',
        priority: 'Más agarre',
      },
    });
    expect(result.strategy).toContain('prioriza agarre delante');
    expect(result.rightFoot).toHaveLength(4);
    expect(result.leftFoot).toHaveLength(4);
  });

  it('cubre disciplina skate cross + estilo explosivo + calor', () => {
    const result = service.calculateWheelPosition({
      wheels: [
        { hardness: '84A', quantity: 4 },
        { hardness: '88A', quantity: 4 },
      ],
      userData: {
        disciplina: 'skate cross',
        pesoKg: 75,
        experiencia: 'intermedio',
        estilo: 'explosivo (velocidad)',
        suelo: 'calle',
        temperatura: 'caluroso',
        priority: 'Más velocidad',
      },
    });
    expect(result.error).toBeUndefined();
    expect(result.rightFoot).toHaveLength(4);
    expect(result.leftFoot).toHaveLength(4);
  });

  it('conserva el multiset de ruedas en un set desbalanceado (4+4 por pie)', () => {
    const wheels = [
      { hardness: '82A', quantity: 1 },
      { hardness: '84A', quantity: 1 },
      { hardness: '86A', quantity: 2 },
      { hardness: '90A', quantity: 4 },
    ];
    const result = service.calculateWheelPosition({
      wheels,
      userData: baseUser,
    });
    expect(result.error).toBeUndefined();
    expect(result.rightFoot).toHaveLength(4);
    expect(result.leftFoot).toHaveLength(4);
    const combined = [...(result.rightFoot ?? []), ...(result.leftFoot ?? [])];
    expect(combined).toHaveLength(8);
    expect(tally(combined)).toEqual({ '82A': 1, '84A': 1, '86A': 2, '90A': 4 });
  });

  it('set numérico priorizando velocidad (paridad)', () => {
    const input: PositioningInput = {
      wheels: [
        { hardness: '83A', quantity: 2 },
        { hardness: '85A', quantity: 4 },
        { hardness: '87A', quantity: 2 },
      ],
      userData: {
        ...baseUser,
        priority: 'Más velocidad',
        disciplina: 'velocidad',
      },
    };
    expect(service.calculateWheelPosition(input)).toEqual({
      rightFoot: ['85A', '85A', '83A', '87A'],
      leftFoot: ['85A', '85A', '83A', '87A'],
      strategy:
        'Configuración prioriza velocidad delante y optimizado para velocidad basada en tu perfil.',
      userContext: {
        disciplina: 'velocidad',
        priority: 'Más velocidad',
        estilo: 'mixto',
      },
    });
  });
});
