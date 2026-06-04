import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RecommendationFormDto } from './dto/recommendation-form.dto';
import { RecommendationService } from './recommendation.service';
import { RecommendationResult, Rule } from './recommendation.types';

@ApiTags('recommendation')
@Controller()
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  /** Calcula una recomendación de ruedas a partir del perfil del patinador. */
  @Post('recommendation')
  @ApiOperation({
    summary: 'Recomendación de ruedas a partir del perfil del patinador',
  })
  getRecommendation(@Body() form: RecommendationFormDto): RecommendationResult {
    return this.recommendationService.getRecommendation(form);
  }

  /** Reglas de recomendación vigentes (lectura). */
  @Get('rules')
  @ApiOperation({ summary: 'Reglas de recomendación vigentes' })
  getRules(): Rule[] {
    return this.recommendationService.getRules();
  }
}
