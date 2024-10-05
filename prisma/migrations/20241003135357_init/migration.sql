-- DropForeignKey
ALTER TABLE `item` DROP FOREIGN KEY `Item_detailId_fkey`;

-- DropForeignKey
ALTER TABLE `itemtransaction` DROP FOREIGN KEY `ItemTransaction_approvedBorrowId_fkey`;

-- DropForeignKey
ALTER TABLE `itemtransaction` DROP FOREIGN KEY `ItemTransaction_approvedReturnId_fkey`;

-- DropForeignKey
ALTER TABLE `itemtransaction` DROP FOREIGN KEY `ItemTransaction_borrowerId_fkey`;

-- DropForeignKey
ALTER TABLE `itemtransaction` DROP FOREIGN KEY `ItemTransaction_itemId_fkey`;

-- AddForeignKey
ALTER TABLE `ItemTransaction` ADD CONSTRAINT `ItemTransaction_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemTransaction` ADD CONSTRAINT `ItemTransaction_borrowerId_fkey` FOREIGN KEY (`borrowerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemTransaction` ADD CONSTRAINT `ItemTransaction_approvedBorrowId_fkey` FOREIGN KEY (`approvedBorrowId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemTransaction` ADD CONSTRAINT `ItemTransaction_approvedReturnId_fkey` FOREIGN KEY (`approvedReturnId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_detailId_fkey` FOREIGN KEY (`detailId`) REFERENCES `ItemDetail`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
