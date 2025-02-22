import { CharactersService } from './characters.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

describe('CharactersService', () => {
  let characterService: CharactersService;
  let prismaMock: DeepMockProxy<PrismaClient>;
  const character = {
    id: 1,
    user_name: 'existing-user',
    name: 'Existing User',
    level: 10,
    hit_points: 15,
    temporary_hit_points: 5,
    strength: 15,
    dexterity: 12,
    constitution: 14,
    intelligence: 13,
    wisdom: 10,
    charisma: 8,
    created_at: new Date(),
    updated_at: new Date(),
    character_defenses: [
      {
        damage_type_id: 1,
        defense_type_id: 1,
        defense_type: { id: 1, name: 'immunity' },
        damage_type: { id: 1, name: 'fire' },
      },
      {
        damage_type_id: 2,
        defense_type_id: 2,
        defense_type: { id: 2, name: 'resistance' },
        damage_type: { id: 2, name: 'slashing' },
      },
    ],
  };

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    characterService = module.get<CharactersService>(CharactersService);
  });

  describe('findOne', () => {
    it('should succeed', async () => {
      prismaMock.characters.findUnique.mockResolvedValue(character);

      const result = await characterService.findOne(character.user_name);
      expect(result).toEqual(character);
    });

    it('should fail if user does not exist', async () => {
      prismaMock.characters.findUnique.mockResolvedValue(null);

      try {
        await characterService.findOne('other');
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });

  describe('healing', () => {
    it('should succeed', async () => {
      prismaMock.characters.findUnique.mockResolvedValue(character);

      const dto = { amount: 5 };

      const result = await characterService.heal(character.user_name, dto);
      expect(prismaMock.characters.update).toBeCalledWith({
        where: { user_name: character.user_name },
        data: { hit_points: { increment: dto.amount } },
      });
    });

    it('should fail if healing amount is negative', async () => {
      prismaMock.characters.findUnique.mockResolvedValue(character);

      const dto = { amount: -1 };

      try {
        await characterService.heal(character.user_name, dto);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    it('should fail if username does not exist', async () => {
      prismaMock.characters.findUnique.mockResolvedValue(character);

      const dto = { amount: 10 };

      try {
        await characterService.heal('other', dto);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });

  describe('temporary hp', () => {
    it('should succeed picking largest temporary hp', async () => {
      prismaMock.characters.findUnique.mockResolvedValue(character);

      const dto = { amount: 20 };

      await characterService.addTemporaryHp(character.user_name, dto);
      expect(prismaMock.characters.update).toBeCalledWith({
        where: { user_name: character.user_name },
        data: {
          temporary_hit_points: Math.max(
            dto.amount,
            character.temporary_hit_points,
          ),
        },
      });
    });

    it('should succeed not changing temp hp', async () => {
      prismaMock.characters.findUnique.mockResolvedValue(character);

      const dto = { amount: character.temporary_hit_points - 1 };

      await characterService.addTemporaryHp(character.user_name, dto);
      expect(prismaMock.characters.update).toBeCalledWith({
        where: { user_name: character.user_name },
        data: { temporary_hit_points: character.temporary_hit_points },
      });
    });

    it('should fail if healing amount is negative', async () => {
      prismaMock.characters.findUnique.mockResolvedValue(character);

      const dto = { amount: -1 };

      try {
        await characterService.addTemporaryHp(character.user_name, dto);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    it('should fail if username does not exist', async () => {
      prismaMock.characters.findUnique.mockResolvedValue(character);

      const dto = { amount: 10 };

      try {
        await characterService.addTemporaryHp('other', dto);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });

  describe('damage', () => {
    it('should hit temp hp only', async () => {
      const dto = { amount: 1, type: 'cold' };

      prismaMock.characters.findUnique.mockResolvedValue(character);
      prismaMock.damage_types.findUnique.mockResolvedValue({
        id: 3,
        name: 'cold',
        created_at: new Date(),
        updated_at: new Date(),
      });

      await characterService.damage(character.user_name, dto);
      expect(prismaMock.characters.update).toBeCalledWith({
        where: { user_name: character.user_name },
        data: {
          hit_points: character.hit_points,
          temporary_hit_points: character.temporary_hit_points - 1,
        },
      });
    });

    it('should hit both temp and health', async () => {
      const dto = { amount: 10, type: 'cold' };

      prismaMock.characters.findUnique.mockResolvedValue(character);
      prismaMock.damage_types.findUnique.mockResolvedValue({
        id: 3,
        name: 'cold',
        created_at: new Date(),
        updated_at: new Date(),
      });

      await characterService.damage(character.user_name, dto);
      expect(prismaMock.characters.update).toBeCalledWith({
        where: { user_name: character.user_name },
        data: {
          hit_points: character.hit_points - 5,
          temporary_hit_points: character.temporary_hit_points - 5,
        },
      });
    });

    it('should not go lower than 0', async () => {
      const dto = { amount: 1000, type: 'cold' };

      prismaMock.characters.findUnique.mockResolvedValue(character);
      prismaMock.damage_types.findUnique.mockResolvedValue({
        id: 3,
        name: 'cold',
        created_at: new Date(),
        updated_at: new Date(),
      });

      await characterService.damage(character.user_name, dto);
      expect(prismaMock.characters.update).toBeCalledWith({
        where: { user_name: character.user_name },
        data: {
          hit_points: 0,
          temporary_hit_points: 0,
        },
      });
    });

    it('should reduce damage by half if resistant', async () => {
      const dto = { amount: 4, type: 'slashing' };

      prismaMock.characters.findUnique.mockResolvedValue(character);
      prismaMock.damage_types.findUnique.mockResolvedValue({
        id: 2,
        name: 'slashing',
        created_at: new Date(),
        updated_at: new Date(),
      });

      await characterService.damage(character.user_name, dto);
      expect(prismaMock.characters.update).toBeCalledWith({
        where: { user_name: character.user_name },
        data: {
          hit_points: character.hit_points,
          temporary_hit_points:
            character.temporary_hit_points - Math.floor(dto.amount / 2),
        },
      });
    });

    it('should negate damage if immune', async () => {
      const dto = { amount: 4, type: 'immunity' };

      prismaMock.characters.findUnique.mockResolvedValue(character);
      prismaMock.damage_types.findUnique.mockResolvedValue({
        id: 1,
        name: 'immunity',
        created_at: new Date(),
        updated_at: new Date(),
      });

      await characterService.damage(character.user_name, dto);
      expect(prismaMock.characters.update).toBeCalledWith({
        where: { user_name: character.user_name },
        data: {
          hit_points: character.hit_points,
          temporary_hit_points: character.temporary_hit_points,
        },
      });
    });

    it('should fail if damage is negative', async () => {
      const dto = { amount: -4, type: 'immunity' };

      prismaMock.characters.findUnique.mockResolvedValue(character);
      prismaMock.damage_types.findUnique.mockResolvedValue({
        id: 1,
        name: 'immunity',
        created_at: new Date(),
        updated_at: new Date(),
      });

      try {
        await characterService.damage(character.user_name, dto);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    it('should fail if user does not exist', async () => {
      const dto = { amount: 4, type: 'immunity' };

      prismaMock.characters.findUnique.mockResolvedValue(character);
      prismaMock.damage_types.findUnique.mockResolvedValue({
        id: 1,
        name: 'immunity',
        created_at: new Date(),
        updated_at: new Date(),
      });

      try {
        await characterService.damage('other', dto);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });
});
