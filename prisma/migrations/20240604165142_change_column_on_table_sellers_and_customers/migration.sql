/*
  Warnings:

  - You are about to drop the column `url_image` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `url_image` on the `customers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `admin` DROP COLUMN `url_image`,
    ADD COLUMN `ava_url_image` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `customers` DROP COLUMN `url_image`,
    ADD COLUMN `ava_url_image` VARCHAR(255) NULL;
