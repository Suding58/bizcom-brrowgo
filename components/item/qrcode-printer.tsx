"use client";

import React, { useEffect, useState } from "react";
import { generateQRCodeWithIcon } from "@/lib/generateQRCode";
import Image from "next/image";

interface QRCodePrinterProps {
  uuids: { name: string; uuid: string }[]; // Modify this to expect an array
}

const QRCodePrinter: React.FC<QRCodePrinterProps> = ({ uuids }) => {
  const [qrCodes, setQrCodes] = useState<string[]>([]);

  useEffect(() => {
    const generateQRCodes = async () => {
      const baseUrl = window.location.origin; // This gets the base URL (e.g., http://localhost:3000 or https://yourdomain.com)

      const qrCodePromises = uuids.map(async (uuid) => {
        return await generateQRCodeWithIcon(
          `${baseUrl}/transaction/${uuid.uuid}`,
          "/logo/bizcom-logo.jpg",
          300,
          300,
          50
        );
      });
      const qrCodeDataURLs = await Promise.all(qrCodePromises);
      setQrCodes(qrCodeDataURLs);
    };

    generateQRCodes();
  }, [uuids]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h1>QR Codes</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {qrCodes.map((qrCodeUrl, index) => (
          <div
            key={index}
            style={{
              margin: "5px",
              textAlign: "center",
              display: "flex", // Use flex to align items
              flexDirection: "column",
              // justifyContent: "space-between", // Space out children
              alignItems: "center",
              width: "240px", // Fixed width for equal sizing
              height: "200px", // Fixed height for equal sizing
              padding: "5px",
              border: "1px solid black",
            }}
          >
            <p
              style={{
                marginBottom: "0px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {uuids[index].name}
            </p>
            <Image
              src={qrCodeUrl}
              alt={`QR Code for UUID ${uuids[index].uuid}`}
              style={{ width: "150px", height: "150px", margin: "0px" }}
            />
            <p style={{ marginTop: "-5px", fontSize: "14px" }}>
              {uuids[index].uuid}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRCodePrinter;
