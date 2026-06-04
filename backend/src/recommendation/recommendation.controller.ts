import { Body, Controller, Get, Post } from '@nestjs/common';
import { RecommendationFormDto } from './dto/recommendation-form.dto';
import { RecommendationService } from './recommendation.service';
import { RecommendationResult, Rule } from './recommendation.types';

@Controller()
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  /** Calcula una recomendación de ruedas a partir del perfil del patinador. */
  @Post('recommendation')
  getRecommendation(@Body() form: RecommendationFormDto): RecommendationResult {
    return this.recommendationService.getRecommendation(form);
  }

  /** Reglas de recomendación vigentes (lectura). */
  @Get('rules')
  getRules(): Rule[] {
    return this.recommendationService.getRules();
  }
}
