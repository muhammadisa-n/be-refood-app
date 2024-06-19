/*
  Warnings:

  - You are about to drop the column `sample_image_product` on the `sellers` table. All the data in the column will be lost.
  - You are about to drop the column `sample_image_url` on the `sellers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sellers` DROP COLUMN `sample_image_product`,
    DROP COLUMN `sample_image_url`,
    ADD COLUMN `sample_image_product_id` VARCHAR(255) NULL,
    ADD COLUMN `sample_image_product_url` VARCHAR(255) NULL;
