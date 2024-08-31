/*
  Warnings:

  - You are about to drop the column `total_produk` on the `order_products` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quantity` to the `order_products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_order_id_fkey`;

-- AlterTable
ALTER TABLE `order_products` DROP COLUMN `total_produk`,
    ADD COLUMN `quantity` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `status_transaksi` ENUM('PENDING', 'PAID', 'CANCEL') NULL DEFAULT 'PENDING',
    ADD COLUMN `tipe_pembayaran` VARCHAR(100) NULL,
    ADD COLUMN `waktu_transaksi` TIMESTAMP(0) NULL;

-- DropTable
DROP TABLE `transactions`;
