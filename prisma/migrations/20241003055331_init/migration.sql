/*
  Warnings:

  - A unique constraint covering the columns `[parcelNumber]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `address` MEDIUMTEXT NOT NULL,
    ADD COLUMN `profileUrl` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Item_parcelNumber_key` ON `Item`(`parcelNumber`);
