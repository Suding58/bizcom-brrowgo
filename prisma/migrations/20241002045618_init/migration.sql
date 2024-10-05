/*
  Warnings:

  - You are about to drop the column `categoryId` on the `item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `brandName` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryName` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeName` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ItemCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `item` DROP FOREIGN KEY `Item_categoryId_fkey`;

-- AlterTable
ALTER TABLE `item` DROP COLUMN `categoryId`,
    ADD COLUMN `brandName` VARCHAR(191) NOT NULL,
    ADD COLUMN `categoryName` VARCHAR(191) NOT NULL,
    ADD COLUMN `typeName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `itemcategory` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `ItemBrand` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ItemBrand_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ItemType_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_categoryName_fkey` FOREIGN KEY (`categoryName`) REFERENCES `ItemCategory`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_typeName_fkey` FOREIGN KEY (`typeName`) REFERENCES `ItemType`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_brandName_fkey` FOREIGN KEY (`brandName`) REFERENCES `ItemBrand`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
