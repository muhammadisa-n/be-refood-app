-- CreateTable
CREATE TABLE `customers` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `provinsi` VARCHAR(100) NOT NULL,
    `kota` VARCHAR(100) NOT NULL,
    `kecamatan` VARCHAR(100) NOT NULL,
    `kelurahan` VARCHAR(100) NOT NULL,
    `kode_pos` VARCHAR(100) NOT NULL,
    `alamat` VARCHAR(255) NOT NULL,
    `no_hp` VARCHAR(15) NOT NULL,
    `ava_image_id` VARCHAR(255) NULL,
    `ava_image_url` VARCHAR(255) NULL,
    `verified_at` DATETIME(3) NULL,
    `refresh_token` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `customers_email_key`(`email`),
    UNIQUE INDEX `customers_no_hp_key`(`no_hp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
