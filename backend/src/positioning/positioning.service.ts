import { Injectable } from '@nestjs/common';
import {
  PositioningInput,
  PositioningResult,
  PositioningStrategy,
  PositioningUserData,
} from './positioning.types';

/**
 * Motor de posicionamiento de ruedas.
 *
 * Port fiel (1:1) de `frontend/src/utils/calculateWheelPosition.js` (versión de
 * `develop`, con distribución equitativa entre ambos pies). La estrategia
 * depende de los datos del patinador (`frontBias`/`speedBias`).
 */
@Injectable()
export class PositioningService {
  /** Mapea cada dureza a un orden de más blanda (1) a más dura (9). */
  private getHardnessOrder(hardness: string): number {
    const order: Record<string, number> = {
      Firm: 1,
      XFirm: 2,
      XXFirm: 3,
      '82A': 1,
      '83A': 2,
      '84A': 3,
      '85A': 4,
      '86A': 5,
      '87A': 6,
      '88A': 7,
      '89A': 8,
      '90A': 9,
    };
    return order[hardness] || 5;
  }

  private compareHardness = (a: string, b: string): number =>
    this.getHardnessOrder(a) - this.getHardnessOrder(b);

  /** Determina la estrategia de posicionamiento según el perfil del usuario. */
  private determinePositioningStrategy(
    userData: PositioningUserData,
  ): PositioningStrategy {
    const { disciplina, estilo, suelo, temperatura, priority } = userData;

    const strategy: PositioningStrategy = {
      frontBias: 0.5,
      speedBias: 0.5,
      description: '',
    };

    // Prioridad del usuario.
    if (priority === 'Más agarre') {
      strategy.frontBias = 0.7;
      strategy.speedBias = 0.2;
    } else if (priority === 'Más velocidad') {
      strategy.frontBias = 0.3;
      strategy.speedBias = 0.8;
    } else {
      strategy.frontBias = 0.5;
      strategy.speedBias = 0.5;
    }

    // Ajustes por disciplina.
    if (disciplina === 'velocidad') {
      strategy.speedBias += 0.2;
      strategy.frontBias -= 0.1;
    } else if (disciplina === 'fondo') {
      strategy.frontBias += 0.1;
      strategy.speedBias -= 0.1;
    } else if (
      disciplina === 'skate cross' ||
      disciplina === 'derrapes' ||
      disciplina === 'free style (calle)'
    ) {
      strategy.frontBias += 0.2;
      strategy.speedBias -= 0.2;
    }

    // Ajustes por estilo.
    if (estilo === 'explosivo (velocidad)') {
      strategy.speedBias += 0.1;
    } else if (estilo === 'tecnico' || estilo === 'free style') {
      strategy.frontBias += 0.1;
    }

    // Ajustes por suelo.
    if (suelo === 'asfalto rugoso' || suelo === 'calle') {
      strategy.frontBias += 0.15;
    } else if (suelo === 'pista') {
      strategy.speedBias += 0.1;
    }

    // Ajustes por temperatura.
    if (temperatura === 'frio') {
      strategy.frontBias += 0.1;
    } else if (temperatura === 'caluroso') {
      strategy.speedBias += 0.1;
    }

    // Normalizar a [0, 1].
    strategy.frontBias = Math.max(0, Math.min(1, strategy.frontBias));
    strategy.speedBias = Math.max(0, Math.min(1, strategy.speedBias));

    // Descripción.
    const parts: string[] = [];
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

    strategy.description =
      parts.length > 0
        ? `Configuración ${parts.join(' y ')} basada en tu perfil.`
        : 'Configuración balanceada basada en tu perfil.';

    return strategy;
  }

  /**
   * Calcula el posicionamiento de las 8 ruedas en ambos pies.
   * Devuelve `{ error }` si el total no es exactamente 8.
   */
  calculateWheelPosition(data: PositioningInput): PositioningResult {
    const { wheels: wheelsData, userData } = data;

    const total = wheelsData.reduce((sum, w) => sum + w.quantity, 0);
    if (total !== 8) {
      return {
        error: `Debes tener exactamente 8 ruedas. Total: ${total}`,
      };
    }

    // Expandir a un array con todas las ruedas.
    const allWheels: string[] = [];
    wheelsData.forEach((wheel) => {
      for (let i = 0; i < wheel.quantity; i++) {
        allWheels.push(wheel.hardness);
      }
    });

    allWheels.sort(this.compareHardness);

    // Todas iguales -> distribución uniforme.
    if (allWheels.every((w) => w === allWheels[0])) {
      const hardness = allWheels[0];
      return {
        rightFoot: [hardness, hardness, hardness, hardness],
        leftFoot: [hardness, hardness, hardness, hardness],
        strategy: 'Todas las ruedas son iguales, distribución uniforme',
      };
    }

    const positioningStrategy = this.determinePositioningStrategy(userData);

    // Agrupar por dureza.
    const wheelsByHardness: Record<string, number> = {};
    allWheels.forEach((wheel) => {
      wheelsByHardness[wheel] = (wheelsByHardness[wheel] || 0) + 1;
    });

    const hardnessTypes = Object.keys(wheelsByHardness).sort(
      this.compareHardness,
    );

    const resultRight: string[] = ['', '', '', ''];
    const resultLeft: string[] = ['', '', '', ''];

    const rightFront: string[] = [];
    const rightBack: string[] = [];
    const leftFront: string[] = [];
    const leftBack: string[] = [];

    const frontBias = positioningStrategy.frontBias;
    // Durezas que van delante; el resto (complemento) va atrás vía `isFront`.
    let frontHardness: string[];

    if (frontBias >= 0.5) {
      // Más blandas delante.
      const splitIndex = Math.max(
        1,
        Math.min(
          hardnessTypes.length - 1,
          Math.round(hardnessTypes.length * frontBias),
        ),
      );
      frontHardness = hardnessTypes.slice(0, splitIndex);
    } else {
      // Más duras delante (velocidad).
      const splitIndex = Math.max(
        1,
        Math.min(
          hardnessTypes.length - 1,
          Math.round(hardnessTypes.length * (1 - frontBias)),
        ),
      );
      frontHardness = hardnessTypes.slice(-splitIndex).reverse();
    }

    // Distribuir cada dureza equitativamente entre ambos pies.
    hardnessTypes.forEach((hardness) => {
      const count = wheelsByHardness[hardness];
      const isFront = frontHardness.includes(hardness);

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

    rightFront.sort(this.compareHardness);
    leftFront.sort(this.compareHardness);
    rightBack.sort(this.compareHardness);
    leftBack.sort(this.compareHardness);

    // Equilibrar 2 delanteras y 2 traseras por pie.
    const balanceGroups = (): void => {
      while (rightFront.length > 2 && rightBack.length < 2) {
        rightBack.push(rightFront.pop() as string);
      }
      while (leftFront.length > 2 && leftBack.length < 2) {
        leftBack.push(leftFront.pop() as string);
      }

      while (rightBack.length > 2 && rightFront.length < 2) {
        rightFront.push(rightBack.pop() as string);
      }
      while (leftBack.length > 2 && leftFront.length < 2) {
        leftFront.push(leftBack.pop() as string);
      }

      while (rightFront.length + rightBack.length < 4) {
        if (leftFront.length > 2) {
          rightFront.push(leftFront.shift() as string);
        } else if (leftBack.length > 2) {
          rightBack.push(leftBack.shift() as string);
        } else {
          break;
        }
      }

      while (leftFront.length + leftBack.length < 4) {
        if (rightFront.length > 2) {
          leftFront.push(rightFront.shift() as string);
        } else if (rightBack.length > 2) {
          leftBack.push(rightBack.shift() as string);
        } else {
          break;
        }
      }
    };

    balanceGroups();

    // Posiciones finales: delanteras 0-1, traseras 2-3.
    resultRight[0] = rightFront[0] || '';
    resultRight[1] = rightFront[1] || rightBack[0] || '';
    resultRight[2] = rightBack[0] || rightFront[1] || '';
    resultRight[3] = rightBack[1] || '';

    resultLeft[0] = leftFront[0] || '';
    resultLeft[1] = leftFront[1] || leftBack[0] || '';
    resultLeft[2] = leftBack[0] || leftFront[1] || '';
    resultLeft[3] = leftBack[1] || '';

    // Completar posiciones vacías con ruedas restantes.
    const allRemaining = [
      ...rightFront.slice(2),
      ...rightBack.slice(2),
      ...leftFront.slice(2),
      ...leftBack.slice(2),
    ].sort(this.compareHardness);

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
        estilo: userData.estilo,
      },
    };
  }
}
