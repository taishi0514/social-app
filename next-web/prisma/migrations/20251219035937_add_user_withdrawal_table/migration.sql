-- AlterTable
ALTER TABLE `users` ADD COLUMN `archived_at` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `user_withdrawals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `reason` VARCHAR(191) NULL,

    UNIQUE INDEX `user_withdrawals_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_withdrawals` ADD CONSTRAINT `user_withdrawals_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
