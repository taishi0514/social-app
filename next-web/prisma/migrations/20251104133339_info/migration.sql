-- CreateTable
CREATE TABLE `info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `salary` INTEGER NULL,
    `walking` INTEGER NULL,
    `workOut` INTEGER NULL,
    `readingHabit` INTEGER NULL,
    `cigarettes` ENUM('never', 'monthly', 'weekly', 'daily') NULL,
    `alcohol` ENUM('never', 'monthly', 'weekly', 'daily') NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `info_userId_key`(`userId`),
    INDEX `info_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `info` ADD CONSTRAINT `info_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
