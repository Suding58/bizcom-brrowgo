/*
  Warnings:

  - You are about to drop the column `categoryName` on the `itemdetail` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `ItemDetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `itemdetail` DROP FOREIGN KEY `ItemDetail_categoryName_fkey`;

-- AlterTable
ALTER TABLE `itemdetail` DROP COLUMN `categoryName`,
    ADD COLUMN `categoryId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ItemDetail` ADD CONSTRAINT `ItemDetail_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ItemCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
