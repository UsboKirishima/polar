-- AlterTable
ALTER TABLE `Profile` ADD COLUMN `avatarUrl` VARCHAR(191) NOT NULL DEFAULT '/pfp_placeholder.png',
    ADD COLUMN `bannerUrl` VARCHAR(191) NOT NULL DEFAULT '/bg_placeholder.jpg';
