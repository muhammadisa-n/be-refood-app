-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `province` VARCHAR(100) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `district` VARCHAR(100) NOT NULL,
    `village` VARCHAR(100) NOT NULL,
    `postal_code` VARCHAR(100) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `no_hp` VARCHAR(15) NOT NULL,
    `role` ENUM('Admin', 'Seller', 'Customer') NOT NULL,
    `refresh_token` VARCHAR(500) NULL,
    `verified_at` BOOLEAN NULL DEFAULT false,
    `ava_image` VARCHAR(2555) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
