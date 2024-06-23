/*
  Warnings:

  - Made the column `token_transaction` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `token_transaction` VARCHAR(255) NOT NULL;
