import { IsInt, IsPositive, IsString } from 'class-validator';

export class DamageDto {
  @IsString()
  type: string;
  @IsInt()
  @IsPositive()
  amount: number;
}
