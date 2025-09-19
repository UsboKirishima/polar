/*
  Warnings:

  - You are about to drop the column `bannerUrl` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bannerId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Profile` DROP COLUMN `bannerUrl`,
    ADD COLUMN `bannerId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Banner` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL DEFAULT '/bg_placeholder.jpg',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Banner_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Profile_bannerId_key` ON `Profile`(`bannerId`);

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_bannerId_fkey` FOREIGN KEY (`bannerId`) REFERENCES `Banner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
