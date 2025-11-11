/*
  Warnings:

  - You are about to alter the column `cigarettes` on the `info` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Int`.
  - You are about to alter the column `alcohol` on the `info` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Int`.

*/
-- AlterTable
ALTER TABLE `info` MODIFY `cigarettes` INTEGER NULL,
    MODIFY `alcohol` INTEGER NULL;
