-- AlterTable
ALTER TABLE `itemtransaction` MODIFY `statusBorrow` ENUM('PENDING', 'WAITAPPROVAL', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    MODIFY `statusReturn` ENUM('PENDING', 'WAITAPPROVAL', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';
