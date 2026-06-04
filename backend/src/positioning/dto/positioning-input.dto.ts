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
  @IsString()
  @IsIn(allowedValues('wheelHardness') as string[])
  hardness!: string;

  @IsPositive()
  quantity!: number;
}

export class PositioningUserDataDto implements PositioningUserData {
  @IsString()
  @IsIn(allowedValues('disciplina') as string[])
  disciplina!: string;

  @IsPositive()
  pesoKg!: number;

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
}

export class PositioningInputDto implements PositioningInput {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => WheelInputDto)
  wheels!: WheelInputDto[];

  @ValidateNested()
  @Type(() => PositioningUserDataDto)
  userData!: PositioningUserDataDto;
}
