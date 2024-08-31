/*
  Warnings:

  - The primary key for the `admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cart_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `cart_items` table. The data in that column could be lost. The data in that column will be cast from `VarChar(36)` to `Int`.
  - The primary key for the `carts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `customers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `order_products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `order_products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(36)` to `Int`.
  - The primary key for the `products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sellers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sample_image_product_id` on the `sellers` table. All the data in the column will be lost.
  - You are about to drop the column `sample_image_product_url` on the `sellers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cart_id,product_id]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `cart_items` DROP FOREIGN KEY `cart_items_cart_id_fkey`;

-- DropForeignKey
ALTER TABLE `cart_items` DROP FOREIGN KEY `cart_items_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `carts` DROP FOREIGN KEY `carts_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_products` DROP FOREIGN KEY `order_products_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_seller_id_fkey`;

-- AlterTable
ALTER TABLE `admin` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(40) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `cart_items` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `cart_id` VARCHAR(40) NOT NULL,
    MODIFY `product_id` VARCHAR(40) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `carts` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(40) NOT NULL,
    MODIFY `customer_id` VARCHAR(40) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `categories` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(40) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `customers` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(40) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `order_products` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `product_id` VARCHAR(40) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `orders` MODIFY `customer_id` VARCHAR(40) NOT NULL;

-- AlterTable
ALTER TABLE `products` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(40) NOT NULL,
    MODIFY `category_id` VARCHAR(40) NOT NULL,
    MODIFY `seller_id` VARCHAR(40) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `sellers` DROP PRIMARY KEY,
    DROP COLUMN `sample_image_product_id`,
    DROP COLUMN `sample_image_product_url`,
    MODIFY `id` VARCHAR(40) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `cart_items_cart_id_product_id_key` ON `cart_items`(`cart_id`, `product_id`);

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_seller_id_fkey` FOREIGN KEY (`seller_id`) REFERENCES `sellers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_products` ADD CONSTRAINT `order_products_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
