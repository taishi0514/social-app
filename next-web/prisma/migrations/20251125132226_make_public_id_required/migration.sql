/*
  Warnings:

  - Made the column `public_id` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `public_id` VARCHAR(191) NOT NULL;
