/*
  Warnings:

  - Made the column `birth_date` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- Backfill existing NULL/empty values before making columns NOT NULL
UPDATE `users` SET `gender` = 'unspecified' WHERE `gender` IS NULL OR `gender` = '';
UPDATE `users` SET `birth_date` = '2000-01-01' WHERE `birth_date` IS NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `birth_date` DATE NOT NULL,
    MODIFY `gender` VARCHAR(191) NOT NULL;
