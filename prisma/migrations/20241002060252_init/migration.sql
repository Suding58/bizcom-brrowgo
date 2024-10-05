/*
  Warnings:

  - Added the required column `parcelNumber` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `item` ADD COLUMN `parcelNumber` VARCHAR(191) NOT NULL;
