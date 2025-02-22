import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HealDto } from './dto/heal.dto';
import { DamageDto } from './dto/damage.dto';

@Injectable()
export class CharactersService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(userName: string) {
    return this.prisma.characters.findUnique({
      where: { user_name: userName },
      include: {
        character_classes: {
          include: {
            class: true,
          },
        },
        character_items: {
          include: {
            item: true,
            item_modifier_object: true,
            item_modifier_value_type: true,
          },
        },
        character_defenses: {
          include: {
            defense_type: true,
            damage_type: true,
          },
        },
      },
    });
  }

  async damage(userName: string, dto: DamageDto) {
    const character = await this.prisma.characters.findUnique({
      where: { user_name: userName },
      include: {
        character_defenses: {
          include: {
            defense_type: true,
            damage_type: true,
          },
        },
      },
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    if (character.hit_points <= 0) {
      throw new ConflictException('Character is dead');
    }

    const damageType = await this.prisma.damage_types.findUnique({
      where: { name: dto.type },
    });

    if (!damageType) {
      throw new NotFoundException('Damage type not found');
    }

    const defense = character.character_defenses.find(
      (defense) => defense.damage_type_id === damageType.id,
    );

    let adjustedDamage = this.calculateDamage(
      dto.amount,
      defense?.defense_type.name,
    );

    let temporaryHitPoints = character.temporary_hit_points;
    let hitPoints = character.hit_points;

    if (temporaryHitPoints > adjustedDamage) {
      temporaryHitPoints = temporaryHitPoints - adjustedDamage;
    } else {
      hitPoints = hitPoints - (adjustedDamage - temporaryHitPoints);
      temporaryHitPoints = 0;
    }

    await this.prisma.characters.update({
      where: { user_name: userName },
      data: {
        hit_points: Math.max(hitPoints, 0),
        temporary_hit_points: temporaryHitPoints,
      },
    });

    return this.findOne(userName);
  }

  async heal(userName: string, dto: HealDto) {
    const character = await this.prisma.characters.findUnique({
      where: { user_name: userName },
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    await this.prisma.characters.update({
      where: { user_name: userName },
      data: { hit_points: { increment: dto.amount } },
    });

    return this.findOne(userName);
  }

  async addTemporaryHp(userName: string, dto: HealDto) {
    const character = await this.prisma.characters.findUnique({
      where: { user_name: userName },
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    await this.prisma.characters.update({
      where: { user_name: userName },
      data: {
        temporary_hit_points: Math.max(
          character.temporary_hit_points,
          dto.amount,
        ),
      },
    });

    return this.findOne(userName);
  }

  private calculateDamage(amount: number, defenseType?: string) {
    if (defenseType === 'resistance') {
      return Math.floor(amount / 2);
    } else if (defenseType === 'immunity') {
      return 0;
    }

    return amount;
  }
}
