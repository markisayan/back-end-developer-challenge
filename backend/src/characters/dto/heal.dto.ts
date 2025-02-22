import { IsInt, IsPositive } from 'class-validator';

export class HealDto {
  @IsInt()
  @IsPositive()
  amount: number;
}
