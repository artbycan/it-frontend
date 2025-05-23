import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavMenu from "@/app/components/NavMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ระบบจัดการข้อมูลการแจ้งซ่อมครุภัณฑ์ สคร.1",
  description: "ระบบแจ้งซ่อมออนไลน์สคร.1",
  keywords: ["ระบบจัดการข้อมูลการแจ้งซ่อมครุภัณฑ์", "สคร.1"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavMenu />
        {children}
      </body>
    </html>
  );
}
