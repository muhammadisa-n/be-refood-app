/*
  Warnings:

  - You are about to alter the column `nama` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(40)` to `VarChar(30)`.
  - You are about to alter the column `verified_at` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `sellers` MODIFY `nama` VARCHAR(30) NOT NULL,
    MODIFY `verified_at` TIMESTAMP NULL;
