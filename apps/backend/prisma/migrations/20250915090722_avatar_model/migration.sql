/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[avatarId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Profile` DROP COLUMN `avatarUrl`,
    ADD COLUMN `avatarId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Avatar` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL DEFAULT '/pfp_placeholder.png',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Avatar_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Profile_avatarId_key` ON `Profile`(`avatarId`);

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_avatarId_fkey` FOREIGN KEY (`avatarId`) REFERENCES `Avatar`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
