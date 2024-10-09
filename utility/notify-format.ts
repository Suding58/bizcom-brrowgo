import { ItemTransactions } from "@/interface";

const notifyBorrowRequest = (transaction: ItemTransaction) => {
  const { item, borrower } = transaction;
  return `📥 สวัสดี ${borrower.name}, คำขอยืมของคุณสำหรับ "${item.name}" (Parcel Number: ${item.parcelNumber}) ได้รับแล้วและกำลังรอการอนุมัติ ⏳`;
};

const notifyReturnRequest = (transaction: ItemTransaction) => {
  const { item, borrower } = transaction;
  return `🔄 สวัสดี ${borrower.name}, คำขอคืนของคุณสำหรับ "${item.name}" (Parcel Number: ${item.parcelNumber}) ได้รับแล้วและกำลังรอการอนุมัติ ⏳`;
};

const notifyBorrowApproval = (transaction: ItemTransaction) => {
  const { item, borrower, statusBorrow, approvedBorrow } = transaction;
  const statusMessage =
    statusBorrow === "APPROVED" ? "อนุมัติแล้ว ✅" : "ถูกปฏิเสธ ❌";
  return `📢 สวัสดี ${borrower.name}, คำขอยืมของคุณสำหรับ "${item.name}" (Parcel Number: ${item.parcelNumber}) ได้รับการ${statusMessage} โดย ${approvedBorrow?.name}.`;
};

const notifyReturnApproval = (transaction: ItemTransaction) => {
  const { item, borrower, statusReturn, approvedReturn } = transaction;
  const statusMessage =
    statusReturn === "APPROVED" ? "อนุมัติแล้ว ✅" : "ถูกปฏิเสธ ❌";
  return `📢 สวัสดี ${borrower.name}, คำขอคืนของคุณสำหรับ "${item.name}" (Parcel Number: ${item.parcelNumber}) ได้รับการ${statusMessage} โดย ${approvedReturn?.name}.`;
};

const notifyStatusUpdate = (transaction: ItemTransaction) => {
  const { item, borrower, statusBorrow, statusReturn } = transaction;
  let statusMessage = "";

  if (statusBorrow !== "PENDING") {
    statusMessage += `สถานะการยืม: ${
      statusBorrow === "APPROVED" ? "อนุมัติแล้ว ✅" : "รอการอนุมัติ ⏳"
    }. `;
  }
  if (statusReturn !== "PENDING") {
    statusMessage += `สถานะการคืน: ${
      statusReturn === "APPROVED" ? "อนุมัติแล้ว ✅" : "รอการอนุมัติ ⏳"
    }. `;
  }

  return `🔔 สวัสดี ${borrower.name}, สถานะการทำรายการของคุณสำหรับ "${item.name}" (Parcel Number: ${item.parcelNumber}) ได้รับการอัปเดต. ${statusMessage}`;
};
