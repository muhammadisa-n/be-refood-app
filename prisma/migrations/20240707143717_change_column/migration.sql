/*
  Warnings:

  - You are about to drop the column `is_active` on the `sellers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sellers` DROP COLUMN `is_active`,
    ADD COLUMN `status` ENUM('Diterima', 'Ditolak') NULL;
