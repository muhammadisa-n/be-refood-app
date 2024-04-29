-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `address` VARCHAR(100) NULL,
    `no_hp` VARCHAR(15) NOT NULL,
    `role` ENUM('Admin', 'Seller', 'Customer') NOT NULL DEFAULT 'Customer',
    `token` VARCHAR(100) NULL,
    `verified_at` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
