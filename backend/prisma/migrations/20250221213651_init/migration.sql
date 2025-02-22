-- CreateTable
CREATE TABLE "characters" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_name" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "hit_points" INTEGER NOT NULL,
    "temporary_hit_points" INTEGER NOT NULL DEFAULT 0,
    "strength" INTEGER NOT NULL,
    "dexterity" INTEGER NOT NULL,
    "constitution" INTEGER NOT NULL,
    "intelligence" INTEGER NOT NULL,
    "wisdom" INTEGER NOT NULL,
    "charisma" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "classes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "hit_dice_value" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "character_classes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "character_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "class_level" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "character_classes_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "character_classes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "item_modifier_objects" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "item_modifier_value_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "character_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "character_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "item_modifier_object_id" INTEGER NOT NULL,
    "item_modifier_value_type_id" INTEGER NOT NULL,
    "item_modifier_value" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "character_items_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "character_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "character_items_item_modifier_object_id_fkey" FOREIGN KEY ("item_modifier_object_id") REFERENCES "item_modifier_objects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "character_items_item_modifier_value_type_id_fkey" FOREIGN KEY ("item_modifier_value_type_id") REFERENCES "item_modifier_value_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "defense_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "character_defenses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "character_id" INTEGER NOT NULL,
    "damage_type_id" INTEGER NOT NULL,
    "defense_type_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "character_defenses_damage_type_id_fkey" FOREIGN KEY ("damage_type_id") REFERENCES "damage_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "character_defenses_defense_type_id_fkey" FOREIGN KEY ("defense_type_id") REFERENCES "defense_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "character_defenses_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "damage_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "characters_user_name_key" ON "characters"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "classes_name_key" ON "classes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "item_modifier_objects_name_key" ON "item_modifier_objects"("name");

-- CreateIndex
CREATE UNIQUE INDEX "item_modifier_value_types_name_key" ON "item_modifier_value_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "defense_types_name_key" ON "defense_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "damage_types_name_key" ON "damage_types"("name");
