import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class ListPlanetRequestDto {
  @IsString()
  @IsOptional()
  name?: string;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsOptional()
  skip?: number;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsOptional()
  take?: number;
}
