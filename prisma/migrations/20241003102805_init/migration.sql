/*
  Warnings:

  - You are about to drop the column `returbDate` on the `itemtransaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `itemtransaction` DROP COLUMN `returbDate`,
    ADD COLUMN `returnDate` DATETIME(3) NULL;
