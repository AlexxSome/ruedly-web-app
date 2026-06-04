import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { allowedValues } from '../../metadata/metadata.constants';
import { RecommendationForm } from '../recommendation.types';

/**
 * Validación del formulario de recomendación. Los valores admitidos de los
 * factores enum se toman del catálogo (`/metadata`) para no duplicarlos.
 */
export class RecommendationFormDto implements RecommendationForm {
  @IsString()
  @IsIn(allowedValues('disciplina') as string[])
  disciplina!: string;

  @IsPositive()
  pesoKg!: number;

  @IsPositive()
  edad!: number;

  @IsString()
  @IsIn(allowedValues('experiencia') as string[])
  experiencia!: string;

  @IsString()
  @IsIn(allowedValues('estilo') as string[])
  estilo!: string;

  @IsString()
  @IsIn(allowedValues('suelo') as string[])
  suelo!: string;

  @IsOptional()
  @IsString()
  @IsIn(allowedValues('temperatura') as string[])
  temperatura: string = 'sin especificar';

  @IsString()
  @IsIn(allowedValues('priority') as string[])
  priority!: string;

  @IsString()
  @IsIn(allowedValues('modoDureza') as string[])
  modoDureza!: string;

  @IsInt()
  @IsIn(allowedValues('wheelSize') as number[])
  wheelSize!: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(allowedValues('setConfigMode') as string[])
  setConfigMode!: string;
}
