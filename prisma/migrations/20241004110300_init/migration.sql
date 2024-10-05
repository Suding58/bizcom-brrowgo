/*
  Warnings:

  - A unique constraint covering the columns `[cid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `itemtransaction` MODIFY `borrowDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` ADD COLUMN `cid` VARCHAR(13) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_cid_key` ON `User`(`cid`);
