/*
  Warnings:

  - You are about to alter the column `ava_image` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(2555)` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `url_image` VARCHAR(255) NULL,
    MODIFY `ava_image` VARCHAR(255) NULL;
