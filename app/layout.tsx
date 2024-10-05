import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Pridi } from "next/font/google";
import Providers from "./provider";
// If loading a variable font, you don't need to specify the font weight
const pridi = Pridi({
  weight: "400",
  subsets: ["thai"],
});

export const metadata: Metadata = {
  title: "ระบบยืมคืน | แผนเทคโนโลยีธุรกิจดิจิทัล",
  description:
    "ระบบยืมคืนสำหรับแผนเทคโนโลยีธุรกิจดิจิทัล วิทยาลัยการอาชีพปัตตานี",
  keywords:
    "ยืมคืน, เทคโนโลยีธุรกิจดิจิทัล, วิทยาลัยการอาชีพปัตตานี, ระบบยืมคืน",
  authors: [{ name: "ซัมซูดิน มามะ", url: "https://example.com" }], // Replace with actual author name and URL
  creator: "ซัมซูดิน มามะ", // Replace with actual creator name
  publisher: "ซัมซูดิน มามะ", // Replace with actual publisher name
  openGraph: {
    title: "ระบบยืมคืน | แผนเทคโนโลยีธุรกิจดิจิทัล",
    description:
      "ระบบยืมคืนสำหรับแผนเทคโนโลยีธุรกิจดิจิทัล วิทยาลัยการอาชีพปัตตานี",
    url: "https://example.com", // Replace with your actual URL
    siteName: "ระบบยืมคืน",
    images: [
      {
        url: "/logo/bizcom-logo.jpg", // Reference the image in the public directory
        width: 800,
        height: 600,
        alt: "ภาพตัวอย่างระบบยืมคืน",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ระบบยืมคืน | แผนเทคโนโลยีธุรกิจดิจิทัล",
    description:
      "ระบบยืมคืนสำหรับแผนเทคโนโลยีธุรกิจดิจิทัล วิทยาลัยการอาชีพปัตตานี",
    images: [
      // Use 'images' instead of 'image'
      {
        url: "/logo/bizcom-logo.jpg", // Reference the image in the public directory
        alt: "ภาพตัวอย่างระบบยืมคืน",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={pridi.className}>
        <Toaster position="top-right" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
