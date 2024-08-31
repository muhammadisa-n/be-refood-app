/*
  Warnings:

  - You are about to drop the column `product_id` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `total_harga` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `total_produk` on the `carts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `carts` DROP FOREIGN KEY `carts_product_id_fkey`;

-- AlterTable
ALTER TABLE `carts` DROP COLUMN `product_id`,
    DROP COLUMN `total_harga`,
    DROP COLUMN `total_produk`,
    ALTER COLUMN `updated_at` DROP DEFAULT;

-- CreateTable
CREATE TABLE `cart_items` (
    `id` VARCHAR(36) NOT NULL,
    `total_produk` INTEGER NOT NULL,
    `total_harga` INTEGER NOT NULL,
    `cart_id` VARCHAR(36) NOT NULL,
    `product_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
