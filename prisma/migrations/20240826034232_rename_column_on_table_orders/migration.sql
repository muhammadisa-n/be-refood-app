/*
  Warnings:

  - You are about to drop the column `waktu_layanan` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `waktu_layanan`,
    ADD COLUMN `waktu_makan` TIME NULL;
