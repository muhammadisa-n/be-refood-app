/*
  Warnings:

  - You are about to alter the column `verified_at` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `customers` MODIFY `created_at` TIMESTAMP(0) NULL,
    MODIFY `updated_at` TIMESTAMP(0) NULL;

-- AlterTable
ALTER TABLE `sellers` MODIFY `verified_at` TIMESTAMP NULL;
