import axios from "axios";

export const sendLineNotification = async (message: string) => {
  if (!message || message.length === 0) {
    throw new Error("Message not found");
  }

  try {
    const response = await axios.post("/api/sendLineNotification", { message });
    console.log("Line notification sent successfully");
    return response.data;
  } catch (error) {
    console.error("Error sending Line notification:", error);
    throw error;
  }
};
