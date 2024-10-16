import { BorrowReturnRequest, TransactionsApprove } from "@/interface";
import { sendTelegramNotification } from "@/utility/telegramNotifier";
import { sendLineNotification } from "./lineNotifier";

export const notifyBorrowRequest = async (request: BorrowReturnRequest) => {
  const message = `📥 คำขอยืมจาก${request.borrowerName}\n🔑 รหัสรายการ ${request.uuid}\n📦 รายการยืม "${request.itemName}" \n📃 รายละเอียด ${request.itemDetail}\n⏳กำลังรอการอนุมัติยืม`;
  await sendLineNotification(message);
};

export const notifyReturnRequest = async (request: BorrowReturnRequest) => {
  const message = `↩️ คำขอคืนจาก${request.borrowerName}\n🔑 รหัสรายการ ${request.uuid}\n📦 รายการคืน "${request.itemName}" \n📃 รายละเอียด ${request.itemDetail}\n⏳กำลังรอการอนุมัติคืน`;
  await sendLineNotification(message);
};

export const notifyApproveRequest = async (request: TransactionsApprove) => {
  const message = `🔎 อนุมัติ ${request.type}\n🙋🏻‍♂️ คำขอจาก ${request.borrowerName}\n👨🏻‍💻 ผู้อนุมัติ ${request.approveName}\n🔑 รหัสรายการ ${request.uuid}\n📦 รายการยืม "${request.itemName}" \n📃 รายละเอียด ${request.itemDetail}`;
  await sendLineNotification(message);
};
