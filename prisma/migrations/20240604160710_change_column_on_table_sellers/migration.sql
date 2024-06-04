/*
  Warnings:

  - Made the column `link_map_merchant` on table `sellers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `sellers` MODIFY `link_map_merchant` VARCHAR(100) NOT NULL;
