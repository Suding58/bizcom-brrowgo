/*
  Warnings:

  - You are about to drop the `borrowrecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `returnrecord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `borrowrecord` DROP FOREIGN KEY `BorrowRecord_approvedBy_fkey`;

-- DropForeignKey
ALTER TABLE `borrowrecord` DROP FOREIGN KEY `BorrowRecord_borrowerId_fkey`;

-- DropForeignKey
ALTER TABLE `borrowrecord` DROP FOREIGN KEY `BorrowRecord_itemId_fkey`;

-- DropForeignKey
ALTER TABLE `returnrecord` DROP FOREIGN KEY `ReturnRecord_approvedBy_fkey`;

-- DropForeignKey
ALTER TABLE `returnrecord` DROP FOREIGN KEY `ReturnRecord_itemId_fkey`;

-- DropForeignKey
ALTER TABLE `returnrecord` DROP FOREIGN KEY `ReturnRecord_returnerId_fkey`;

-- DropTable
DROP TABLE `borrowrecord`;

-- DropTable
DROP TABLE `returnrecord`;

-- CreateTable
CREATE TABLE `ItemTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemId` INTEGER NOT NULL,
    `borrowerId` INTEGER NOT NULL,
    `borrowDate` DATETIME(3) NOT NULL,
    `returbDate` DATETIME(3) NULL,
    `statusBorrow` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `approvedBorrowId` INTEGER NULL,
    `approvedReturnId` INTEGER NULL,
    `statusReturn` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ItemTransaction` ADD CONSTRAINT `ItemTransaction_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemTransaction` ADD CONSTRAINT `ItemTransaction_borrowerId_fkey` FOREIGN KEY (`borrowerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemTransaction` ADD CONSTRAINT `ItemTransaction_approvedBorrowId_fkey` FOREIGN KEY (`approvedBorrowId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemTransaction` ADD CONSTRAINT `ItemTransaction_approvedReturnId_fkey` FOREIGN KEY (`approvedReturnId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
