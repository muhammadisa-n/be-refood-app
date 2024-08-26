-- AlterTable
ALTER TABLE `products` ADD COLUMN `diskon` INTEGER NULL;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(30) NOT NULL,
    `message` TEXT NOT NULL,
    `user_id` VARCHAR(40) NULL,
    `status` ENUM('READ', 'UNREAD') NOT NULL DEFAULT 'UNREAD',
    `type` ENUM('All', 'PROMO', 'FOR_YOU') NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
