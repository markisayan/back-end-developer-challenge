import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { HealDto } from './dto/heal.dto';
import { DamageDto } from './dto/damage.dto';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get(':user_name')
  findOne(@Param('user_name') userName: string) {
    return this.charactersService.findOne(userName);
  }

  @Post(':user_name/damage')
  damage(@Param('user_name') userName: string, @Body() dto: DamageDto) {
    return this.charactersService.damage(userName, dto);
  }

  @Post(':user_name/heal')
  heal(@Param('user_name') userName: string, @Body() dto: HealDto) {
    return this.charactersService.heal(userName, dto);
  }

  @Post(':user_name/temporary-hp')
  addTemporaryHp(@Param('user_name') userName: string, @Body() dto: HealDto) {
    return this.charactersService.addTemporaryHp(userName, dto);
  }
}
