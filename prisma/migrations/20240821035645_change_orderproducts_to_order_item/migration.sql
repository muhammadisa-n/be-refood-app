/*
  Warnings:

  - You are about to drop the column `total_harga` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `total_produk` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `order_products` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `total_pembayaran` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order_products` DROP FOREIGN KEY `order_products_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_products` DROP FOREIGN KEY `order_products_product_id_fkey`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `total_harga`,
    DROP COLUMN `total_produk`,
    ADD COLUMN `total_pembayaran` INTEGER NOT NULL;

-- DropTable
DROP TABLE `order_products`;

-- CreateTable
CREATE TABLE `order_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(40) NOT NULL,
    `product_id` VARCHAR(40) NOT NULL,
    `total_produk` INTEGER NOT NULL,
    `total_harga` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
