/*
  Warnings:

  - You are about to alter the column `verified_at` on the `admin` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `provinsi` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - You are about to alter the column `kota` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - You are about to alter the column `kecamatan` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - You are about to alter the column `kelurahan` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - You are about to alter the column `kode_pos` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(5)`.
  - You are about to alter the column `alamat` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `kode_pos` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `VarChar(5)`.
  - You are about to alter the column `verified_at` on the `sellers` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `admin` MODIFY `verified_at` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `customers` MODIFY `provinsi` VARCHAR(30) NOT NULL,
    MODIFY `kota` VARCHAR(30) NOT NULL,
    MODIFY `kecamatan` VARCHAR(30) NOT NULL,
    MODIFY `kelurahan` VARCHAR(30) NOT NULL,
    MODIFY `kode_pos` VARCHAR(5) NOT NULL,
    MODIFY `alamat` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `sellers` MODIFY `kode_pos` VARCHAR(5) NOT NULL,
    MODIFY `verified_at` TIMESTAMP NULL;
