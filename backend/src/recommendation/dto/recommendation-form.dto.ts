import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ enum: allowedValues('disciplina'), example: 'velocidad' })
  @IsString()
  @IsIn(allowedValues('disciplina') as string[])
  disciplina!: string;

  @ApiProperty({
    example: 70,
    minimum: 1,
    description: 'Peso del patinador en kg',
  })
  @IsPositive()
  pesoKg!: number;

  @ApiProperty({ example: 25, minimum: 1 })
  @IsPositive()
  edad!: number;

  @ApiProperty({ enum: allowedValues('experiencia'), example: 'intermedio' })
  @IsString()
  @IsIn(allowedValues('experiencia') as string[])
  experiencia!: string;

  @ApiProperty({ enum: allowedValues('estilo'), example: 'mixto' })
  @IsString()
  @IsIn(allowedValues('estilo') as string[])
  estilo!: string;

  @ApiProperty({ enum: allowedValues('suelo'), example: 'pista' })
  @IsString()
  @IsIn(allowedValues('suelo') as string[])
  suelo!: string;

  @ApiProperty({
    enum: allowedValues('temperatura'),
    default: 'sin especificar',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(allowedValues('temperatura') as string[])
  temperatura: string = 'sin especificar';

  @ApiProperty({ enum: allowedValues('priority'), example: 'Más agarre' })
  @IsString()
  @IsIn(allowedValues('priority') as string[])
  priority!: string;

  @ApiProperty({
    enum: allowedValues('modoDureza'),
    example: 'estándar (Firm/XFirm/XXFirm)',
  })
  @IsString()
  @IsIn(allowedValues('modoDureza') as string[])
  modoDureza!: string;

  @ApiProperty({ enum: allowedValues('wheelSize'), example: 100 })
  @IsInt()
  @IsIn(allowedValues('wheelSize') as number[])
  wheelSize!: number;

  @ApiProperty({
    enum: allowedValues('setConfigMode'),
    example: 'Dureza única en todo el set',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(allowedValues('setConfigMode') as string[])
  setConfigMode!: string;
}
