/*
  Warnings:

  - You are about to drop the column `quantity` on the `carts` table. All the data in the column will be lost.
  - Added the required column `total_product` to the `carts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `carts` DROP COLUMN `quantity`,
    ADD COLUMN `total_product` INTEGER NOT NULL;
