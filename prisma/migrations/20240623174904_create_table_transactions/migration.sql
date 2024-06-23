/*
  Warnings:

  - You are about to drop the column `link_file` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `order_token` on the `orders` table. All the data in the column will be lost.
  - Added the required column `delivery_address` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `link_file`,
    DROP COLUMN `order_token`,
    ADD COLUMN `delivery_address` TEXT NOT NULL,
    ADD COLUMN `token_transaction` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `transactions` (
    `id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `customer_name` VARCHAR(100) NOT NULL,
    `customer_email` VARCHAR(100) NOT NULL,
    `customer_phone` VARCHAR(15) NOT NULL,
    `payment_type` VARCHAR(100) NOT NULL,
    `pdf_url` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `transactions_order_id_key`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
