/*
  Warnings:

  - You are about to drop the column `total_produK` on the `orders` table. All the data in the column will be lost.
  - Added the required column `total_produk` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `total_produK`,
    ADD COLUMN `total_produk` INTEGER NOT NULL;
