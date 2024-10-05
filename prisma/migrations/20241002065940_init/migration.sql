/*
  Warnings:

  - Added the required column `brandId` to the `ItemDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `ItemDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `itemdetail` ADD COLUMN `brandId` INTEGER NOT NULL,
    ADD COLUMN `typeId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ItemDetail` ADD CONSTRAINT `ItemDetail_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `ItemBrand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemDetail` ADD CONSTRAINT `ItemDetail_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `ItemType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
