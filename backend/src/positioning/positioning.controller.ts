import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PositioningInputDto } from './dto/positioning-input.dto';
import { PositioningService } from './positioning.service';
import { PositioningResult } from './positioning.types';

@ApiTags('positioning')
@Controller()
export class PositioningController {
  constructor(private readonly positioningService: PositioningService) {}

  /** Distribuye las 8 ruedas en ambos patines según el perfil del usuario. */
  @Post('wheel-position')
  @ApiOperation({
    summary: 'Distribuye 8 ruedas en ambos patines según el perfil',
  })
  calculate(@Body() input: PositioningInputDto): PositioningResult {
    return this.positioningService.calculateWheelPosition(input);
  }
}
