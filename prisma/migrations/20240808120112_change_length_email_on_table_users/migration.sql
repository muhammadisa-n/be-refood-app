/*
  Warnings:

  - You are about to alter the column `email` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to alter the column `verified_at` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `admin` MODIFY `email` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `customers` MODIFY `email` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `sellers` MODIFY `email` VARCHAR(50) NOT NULL,
    MODIFY `verified_at` TIMESTAMP NULL;
