import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MetadataService } from './metadata.service';
import { Factor, FactorFlow, Metadata } from './metadata.types';

@ApiTags('metadata')
@Controller('metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  /**
   * Catálogo de factores y valores admitidos.
   * Opcionalmente filtra por flujo: `?flow=recommendation|positioning`.
   */
  @Get()
  getMetadata(
    @Query('flow') flow?: FactorFlow,
  ): Metadata | { version: string; factors: Factor[] } {
    const metadata = this.metadataService.getMetadata();

    if (flow === 'recommendation' || flow === 'positioning') {
      return {
        version: metadata.version,
        factors: this.metadataService.getFactorsForFlow(flow),
      };
    }

    return metadata;
  }
}
