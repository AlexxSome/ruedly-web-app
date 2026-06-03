import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { PositioningModule } from './positioning/positioning.module';
import { RecommendationModule } from './recommendation/recommendation.module';

@Module({
  imports: [
    // Carga las variables de entorno (.env) y las hace accesibles vía ConfigService.
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    RecommendationModule,
    PositioningModule,
  ],
})
export class AppModule {}
