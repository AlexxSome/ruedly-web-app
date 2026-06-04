import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { allowedValues } from '../../metadata/metadata.constants';
import {
  PositioningInput,
  PositioningUserData,
  WheelInput,
} from '../positioning.types';

export class WheelInputDto implements WheelInput {
  @ApiProperty({ enum: allowedValues('wheelHardness'), example: 'Firm' })
  @IsString()
  @IsIn(allowedValues('wheelHardness') as string[])
  hardness!: string;

  @ApiProperty({
    example: 4,
    minimum: 1,
    description: 'Cantidad de ruedas de esta dureza',
  })
  @IsPositive()
  quantity!: number;
}

export class PositioningUserDataDto implements PositioningUserData {
  @ApiProperty({ enum: allowedValues('disciplina'), example: 'fondo' })
  @IsString()
  @IsIn(allowedValues('disciplina') as string[])
  disciplina!: string;

  @ApiProperty({ example: 70, minimum: 1 })
  @IsPositive()
  pesoKg!: number;

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
}

export class PositioningInputDto implements PositioningInput {
  @ApiProperty({
    type: [WheelInputDto],
    description: 'Ruedas disponibles; el total debe ser exactamente 8',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => WheelInputDto)
  wheels!: WheelInputDto[];

  @ApiProperty({ type: PositioningUserDataDto })
  @ValidateNested()
  @Type(() => PositioningUserDataDto)
  userData!: PositioningUserDataDto;
}
