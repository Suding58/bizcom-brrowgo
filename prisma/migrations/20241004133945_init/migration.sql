-- AlterTable
ALTER TABLE `itemtransaction` MODIFY `statusBorrow` ENUM('PENDING', 'APPROVED', 'WAITAPPROVAL', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    MODIFY `statusReturn` ENUM('PENDING', 'APPROVED', 'WAITAPPROVAL', 'REJECTED') NOT NULL DEFAULT 'PENDING';
