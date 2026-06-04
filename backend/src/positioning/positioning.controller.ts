import { Body, Controller, Post } from '@nestjs/common';
import { PositioningInputDto } from './dto/positioning-input.dto';
import { PositioningService } from './positioning.service';
import { PositioningResult } from './positioning.types';

@Controller()
export class PositioningController {
  constructor(private readonly positioningService: PositioningService) {}

  /** Distribuye las 8 ruedas en ambos patines según el perfil del usuario. */
  @Post('wheel-position')
  calculate(@Body() input: PositioningInputDto): PositioningResult {
    return this.positioningService.calculateWheelPosition(input);
  }
}
