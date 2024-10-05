/*
  Warnings:

  - You are about to drop the column `brandName` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `categoryName` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `typeName` on the `item` table. All the data in the column will be lost.
  - Added the required column `detailId` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemCategoryId` to the `ItemType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `item` DROP FOREIGN KEY `Item_brandName_fkey`;

-- DropForeignKey
ALTER TABLE `item` DROP FOREIGN KEY `Item_categoryName_fkey`;

-- DropForeignKey
ALTER TABLE `item` DROP FOREIGN KEY `Item_typeName_fkey`;

-- AlterTable
ALTER TABLE `item` DROP COLUMN `brandName`,
    DROP COLUMN `categoryName`,
    DROP COLUMN `status`,
    DROP COLUMN `typeName`,
    ADD COLUMN `detailId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `itembrand` ADD COLUMN `itemCategoryId` INTEGER NULL;

-- AlterTable
ALTER TABLE `itemtype` ADD COLUMN `itemCategoryId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `ItemDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_detailId_fkey` FOREIGN KEY (`detailId`) REFERENCES `ItemDetail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemDetail` ADD CONSTRAINT `ItemDetail_categoryName_fkey` FOREIGN KEY (`categoryName`) REFERENCES `ItemCategory`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemType` ADD CONSTRAINT `ItemType_itemCategoryId_fkey` FOREIGN KEY (`itemCategoryId`) REFERENCES `ItemCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemBrand` ADD CONSTRAINT `ItemBrand_itemCategoryId_fkey` FOREIGN KEY (`itemCategoryId`) REFERENCES `ItemCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
