/*
  Warnings:

  - Added the required column `description` to the `sellers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sellers` ADD COLUMN `description` TEXT NOT NULL;
