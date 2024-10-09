// utils/telegramNotifier.ts
import axios from "axios";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export const sendTelegramNotification = async (message: string) => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error("Telegram Bot Token or Chat ID is not defined");
  }
  if (!message || message.length == 0) {
    throw new Error("Message not found");
  }
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: `🚨แจ้งเตือน🚨\n${message}`,
    });
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
  }
};
