import { NextResponse } from "next/server";
import axios from "axios";
export const dynamic = "force-dynamic";

const LINE_NOTIFY_TOKEN = process.env.LINE_NOTIFY_TOKEN;

export async function POST(request: Request) {
  const { message } = await request.json();

  if (!message) {
    return NextResponse.json(
      { message: "Message is required" },
      { status: 400 }
    );
  }

  try {
    await axios.post(
      "https://notify-api.line.me/api/notify",
      { message: `\n🚨แจ้งเตือน🚨\n${message}` },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${LINE_NOTIFY_TOKEN}`,
        },
      }
    );

    return NextResponse.json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending Line notification:", error);
    return NextResponse.json(
      { message: "Failed to send notification" },
      { status: 500 }
    );
  }
}
