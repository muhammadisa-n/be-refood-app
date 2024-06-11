/*
  Warnings:

  - You are about to drop the column `ava_image` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `ava_url_image` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `ava_image` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `ava_url_image` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `product_image` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `product_url_image` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `ava_image` on the `sellers` table. All the data in the column will be lost.
  - You are about to drop the column `ava_url_image` on the `sellers` table. All the data in the column will be lost.
  - You are about to drop the column `product_image` on the `sellers` table. All the data in the column will be lost.
  - You are about to drop the column `product_url_image` on the `sellers` table. All the data in the column will be lost.
  - Added the required column `image_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` DROP COLUMN `ava_image`,
    DROP COLUMN `ava_url_image`,
    ADD COLUMN `ava_image_id` VARCHAR(255) NULL,
    ADD COLUMN `ava_image_url` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `customers` DROP COLUMN `ava_image`,
    DROP COLUMN `ava_url_image`,
    ADD COLUMN `ava_image_id` VARCHAR(255) NULL,
    ADD COLUMN `ava_image_url` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `product_image`,
    DROP COLUMN `product_url_image`,
    ADD COLUMN `image_id` VARCHAR(255) NOT NULL,
    ADD COLUMN `image_url` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `sellers` DROP COLUMN `ava_image`,
    DROP COLUMN `ava_url_image`,
    DROP COLUMN `product_image`,
    DROP COLUMN `product_url_image`,
    ADD COLUMN `ava_image_id` VARCHAR(255) NULL,
    ADD COLUMN `ava_image_url` VARCHAR(255) NULL;
