/*
  Warnings:

  - You are about to drop the column `total_harga` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `total_produk` on the `order_items` table. All the data in the column will be lost.
  - Added the required column `sub_total_harga` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub_total_produk` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_produk` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order_items` DROP COLUMN `total_harga`,
    DROP COLUMN `total_produk`,
    ADD COLUMN `sub_total_harga` INTEGER NOT NULL,
    ADD COLUMN `sub_total_produk` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `total_produk` INTEGER NOT NULL;
