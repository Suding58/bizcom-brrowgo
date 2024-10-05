// lib/generateQRCode.ts
import QRCode from "qrcode";

export const generateQRCodeWithIcon = async (
  text: string,
  iconUrl: string,
  canvasWidth: number = 300,
  canvasHeight: number = 300,
  iconSize: number = 50
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Unable to get canvas context"));
      return;
    }

    QRCode.toDataURL(text)
      .then((qrCodeDataURL) => {
        const qrCodeImage = new Image();
        qrCodeImage.src = qrCodeDataURL;

        qrCodeImage.onload = () => {
          // วาด QR Code
          ctx.drawImage(qrCodeImage, 0, 0, canvas.width, canvas.height);

          // วาดไอคอนตรงกลาง
          const icon = new Image();
          icon.src = iconUrl;
          icon.onload = () => {
            const x = (canvas.width - iconSize) / 2;
            const y = (canvas.height - iconSize) / 2;
            ctx.drawImage(icon, x, y, iconSize, iconSize);

            // แปลง canvas เป็น data URL และส่งกลับ
            resolve(canvas.toDataURL());
          };
          icon.onerror = () => reject(new Error("Failed to load icon"));
        };
        qrCodeImage.onerror = () =>
          reject(new Error("Failed to load QR code image"));
      })
      .catch((error) => {
        console.error("Error generating QR code:", error);
        reject(new Error("Failed to generate QR code"));
      });
  });
};
