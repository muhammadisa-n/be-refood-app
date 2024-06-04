-- CreateTable
CREATE TABLE `customers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `province` VARCHAR(100) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `district` VARCHAR(100) NOT NULL,
    `village` VARCHAR(100) NOT NULL,
    `postal_code` VARCHAR(100) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `no_hp` VARCHAR(15) NOT NULL,
    `ava_image` VARCHAR(255) NULL,
    `url_image` VARCHAR(255) NULL,
    `refresh_token` VARCHAR(500) NULL,

    UNIQUE INDEX `customers_email_key`(`email`),
    UNIQUE INDEX `customers_no_hp_key`(`no_hp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
