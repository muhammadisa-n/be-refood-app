/*
  Warnings:

  - Added the required column `category` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `category` VARCHAR(100) NOT NULL,
    ADD COLUMN `is_valid` BOOLEAN NOT NULL DEFAULT false;
