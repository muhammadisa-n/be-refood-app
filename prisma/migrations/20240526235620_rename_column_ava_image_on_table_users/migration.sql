/*
  Warnings:

  - You are about to drop the column `ava_image` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `ava_image`,
    ADD COLUMN `image` VARCHAR(255) NULL;
