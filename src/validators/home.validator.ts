import { Type } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class DateParamsDto {
  @IsNumber()
  @IsInt()
  @Min(1_000_000_000_000)
  @Max(10_000_000_000_000)
  @IsDefined()
  @Type(() => Number)
  startFrom: number;

  @IsNumber()
  @IsInt()
  @Min(1_000_000_000_000)
  @Max(10_000_000_000_000)
  @IsOptional()
  @Type(() => Number)
  endTo: number;

  @IsNumber()
  @IsInt()
  @Min(10)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  take: number;
}

export class PaginationDto {
  @IsNumber()
  @IsInt()
  @Min(0)
  @IsDefined()
  @Type(() => Number)
  skip: number;

  @IsNumber()
  @IsInt()
  @Min(10)
  @Max(100)
  @IsDefined()
  @Type(() => Number)
  take: number;
}
