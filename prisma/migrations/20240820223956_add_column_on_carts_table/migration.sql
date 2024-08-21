/*
  Warnings:

  - Added the required column `seller_id` to the `carts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `carts` ADD COLUMN `seller_id` VARCHAR(40) NOT NULL;
