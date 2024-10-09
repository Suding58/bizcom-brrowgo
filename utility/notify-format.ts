import { BorrowReturnRequest, TransactionsApprove } from "@/interface";
import { sendTelegramNotification } from "@/utility/telegramNotifier";
export const notifyBorrowRequest = (request: BorrowReturnRequest) => {
  const message = `📥 คำขอยืมจาก${request.borrowerName}\n🔑 รหัสรายการ ${request.uuid}\n📦 รายการยืม "${request.itemName}" \n📃 รายละเอียด ${request.itemDetail}\n⏳กำลังรอการอนุมัติยืม`;
  sendTelegramNotification(message);
};

export const notifyReturnRequest = (request: BorrowReturnRequest) => {
  const message = `↩️ คำขอคืนจาก${request.borrowerName}\n🔑 รหัสรายการ ${request.uuid}\n📦 รายการคืน "${request.itemName}" \n📃 รายละเอียด ${request.itemDetail}\n⏳กำลังรอการอนุมัติคืน`;
  sendTelegramNotification(message);
};

export const notifyApproveRequest = (request: TransactionsApprove) => {
  const message = `🔎 อนุมัติ ${request.type}\n👨🏻‍💻 ผู้อนุมัติ ${request.approveName}\n🔑 รหัสรายการ ${request.uuid}\n📦 รายการยืม "${request.itemName}" \n📃 รายละเอียด ${request.itemDetail}`;
  sendTelegramNotification(message);
};
