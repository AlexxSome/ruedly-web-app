import { Injectable } from '@nestjs/common';
import { METADATA } from './metadata.constants';
import { Factor, FactorFlow, Metadata } from './metadata.types';

/**
 * Provee el catálogo de factores y valores admitidos.
 * Fuente única para construir los formularios de los clientes.
 */
@Injectable()
export class MetadataService {
  getMetadata(): Metadata {
    return METADATA;
  }

  /** Factores que aplican a un flujo concreto. */
  getFactorsForFlow(flow: FactorFlow): Factor[] {
    return METADATA.factors.filter((f) => f.appliesTo.includes(flow));
  }
}
