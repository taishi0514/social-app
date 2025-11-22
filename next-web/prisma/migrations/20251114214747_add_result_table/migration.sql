-- CreateTable
CREATE TABLE `result` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `metric` ENUM('salary', 'walking', 'workOut', 'readingHabit', 'cigarettes', 'alcohol') NOT NULL,
    `score` INTEGER NOT NULL,
    `percentile` INTEGER NOT NULL,
    `computed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `result_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `result` ADD CONSTRAINT `result_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
