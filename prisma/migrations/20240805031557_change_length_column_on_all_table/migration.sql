/*
  Warnings:

  - The primary key for the `admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `admin` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `nama` on the `admin` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - You are about to alter the column `email` on the `admin` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - You are about to alter the column `ava_image_id` on the `admin` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `ava_image_url` on the `admin` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(200)`.
  - You are about to alter the column `refresh_token` on the `admin` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(350)`.
  - The primary key for the `carts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `carts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `customer_id` on the `carts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `product_id` on the `carts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `nama` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - The primary key for the `customers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `nama` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - You are about to alter the column `ava_image_id` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `ava_image_url` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(200)`.
  - You are about to alter the column `refresh_token` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(350)`.
  - The primary key for the `order_products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `order_products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `order_id` on the `order_products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(40)`.
  - You are about to alter the column `product_id` on the `order_products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - The primary key for the `orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(40)`.
  - You are about to alter the column `customer_id` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `token_transaction` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(36)`.
  - You are about to alter the column `tipe_pembayaran` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(20)`.
  - The primary key for the `products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `nama` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - You are about to alter the column `image_id` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `image_url` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(200)`.
  - You are about to alter the column `category_id` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `seller_id` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(36)`.
  - The primary key for the `sellers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `nama` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(40)`.
  - You are about to alter the column `email` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - You are about to alter the column `provinsi` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - You are about to alter the column `kota` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - You are about to alter the column `kecamatan` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - You are about to alter the column `kelurahan` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - You are about to alter the column `kode_pos` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - You are about to alter the column `alamat` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `ava_image_id` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `ava_image_url` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(200)`.
  - You are about to alter the column `link_map_alamat_toko` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(25)`.
  - You are about to alter the column `sample_image_product_id` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `sample_image_product_url` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `refresh_token` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(350)`.

*/
-- DropForeignKey
ALTER TABLE `carts` DROP FOREIGN KEY `carts_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `carts` DROP FOREIGN KEY `carts_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_products` DROP FOREIGN KEY `order_products_order_id_fkey`;

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
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `nama` VARCHAR(30) NOT NULL,
    MODIFY `email` VARCHAR(30) NOT NULL,
    MODIFY `ava_image_id` VARCHAR(100) NULL,
    MODIFY `ava_image_url` VARCHAR(200) NULL,
    MODIFY `refresh_token` VARCHAR(350) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `carts` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `customer_id` VARCHAR(36) NOT NULL,
    MODIFY `product_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `categories` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `nama` VARCHAR(30) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `customers` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `nama` VARCHAR(30) NOT NULL,
    MODIFY `ava_image_id` VARCHAR(100) NULL,
    MODIFY `ava_image_url` VARCHAR(200) NULL,
    MODIFY `refresh_token` VARCHAR(350) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `order_products` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `order_id` VARCHAR(40) NOT NULL,
    MODIFY `product_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `orders` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(40) NOT NULL,
    MODIFY `customer_id` VARCHAR(36) NOT NULL,
    MODIFY `status_order` ENUM('SUKSES', 'SELESAI', 'PROSES', 'PENDING', 'CANCEL') NOT NULL DEFAULT 'PENDING',
    MODIFY `token_transaction` VARCHAR(36) NULL,
    MODIFY `tipe_pembayaran` VARCHAR(20) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `products` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `nama` VARCHAR(30) NOT NULL,
    MODIFY `image_id` VARCHAR(100) NOT NULL,
    MODIFY `image_url` VARCHAR(200) NOT NULL,
    MODIFY `category_id` VARCHAR(36) NOT NULL,
    MODIFY `seller_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `sellers` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `nama` VARCHAR(40) NOT NULL,
    MODIFY `email` VARCHAR(30) NOT NULL,
    MODIFY `provinsi` VARCHAR(30) NOT NULL,
    MODIFY `kota` VARCHAR(30) NOT NULL,
    MODIFY `kecamatan` VARCHAR(30) NOT NULL,
    MODIFY `kelurahan` VARCHAR(30) NOT NULL,
    MODIFY `kode_pos` VARCHAR(30) NOT NULL,
    MODIFY `alamat` VARCHAR(100) NOT NULL,
    MODIFY `ava_image_id` VARCHAR(100) NULL,
    MODIFY `ava_image_url` VARCHAR(200) NULL,
    MODIFY `link_map_alamat_toko` VARCHAR(25) NULL,
    MODIFY `sample_image_product_id` VARCHAR(100) NULL,
    MODIFY `sample_image_product_url` VARCHAR(100) NULL,
    MODIFY `refresh_token` VARCHAR(350) NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_seller_id_fkey` FOREIGN KEY (`seller_id`) REFERENCES `sellers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_products` ADD CONSTRAINT `order_products_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_products` ADD CONSTRAINT `order_products_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
