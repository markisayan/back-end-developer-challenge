insert into characters (name, user_name, level, hit_points, updated_at, strength, dexterity, constitution, intelligence,
                        wisdom,
                        charisma)
values ('Briv', 'briv', 5, 25, datetime('now'), 15, 12, 14, 13, 10, 8);

insert into classes (name, hit_dice_value, updated_at)
values ('fighter', 10, datetime('now'));

insert into character_classes (character_id, class_id, class_level, updated_at)
values ((select id from characters where name = 'Briv'), (select id from classes where name = 'fighter'), 5,
        datetime('now'));

insert into damage_types (name, updated_at)
values ('bludgeoning', datetime('now')),
       ('piercing', datetime('now')),
       ('slashing', datetime('now')),
       ('fire', datetime('now')),
       ('cold', datetime('now')),
       ('acid', datetime('now')),
       ('thunder', datetime('now')),
       ('lightning', datetime('now')),
       ('poison', datetime('now')),
       ('radiant', datetime('now')),
       ('necrotic', datetime('now')),
       ('psychic', datetime('now')),
       ('force', datetime('now'));
insert into defense_types (name, updated_at)
values ('immunity', datetime('now')),
       ('resistance', datetime('now'));
insert into character_defenses (character_id, damage_type_id, defense_type_id, updated_at)
values ((select id from characters where name = 'Briv'), (select id from damage_types where name = 'fire'),
        (select id from defense_types where name = 'immunity'), datetime('now')),
       ((select id from characters where name = 'Briv'), (select id from damage_types where name = 'slashing'),
        (select id from defense_types where name = 'resistance'), datetime('now'));

insert into items (name, updated_at)
values ('Ioun Stone of Fortitude', datetime('now'));
insert into item_modifier_objects (name, updated_at)
values ('stats', datetime('now'));
insert into item_modifier_value_types (name, updated_at)
values ('constitution', datetime('now'));
insert into character_items (character_id, item_id, item_modifier_object_id, item_modifier_value_type_id,
                             item_modifier_value, updated_at)
values ((select id from characters where name = 'Briv'), (select id from items where name = 'Ioun Stone of Fortitude'),
        (select id from item_modifier_objects where name = 'stats'),
        (select id from item_modifier_value_types where name = 'constitution'), 2, datetime('now'));
