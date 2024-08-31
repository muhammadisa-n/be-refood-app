-- AlterTable
ALTER TABLE `orders` MODIFY `status_transaksi` ENUM('PENDING', 'PAID', 'CANCEL', 'FAIL') NULL DEFAULT 'PENDING';
