/*
  Warnings:

  - You are about to drop the column `image` on the `admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `admin` DROP COLUMN `image`,
    ADD COLUMN `ava_image` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `sellers` (
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
    `ava_url_image` VARCHAR(255) NULL,
    `link_map_merchant` VARCHAR(100) NULL,
    `product_image` VARCHAR(255) NULL,
    `product_url_image` VARCHAR(255) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT false,
    `verified_at` DATETIME(3) NULL,
    `refresh_token` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `sellers_email_key`(`email`),
    UNIQUE INDEX `sellers_no_hp_key`(`no_hp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
