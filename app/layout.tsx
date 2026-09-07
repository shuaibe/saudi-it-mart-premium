import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saudi IT Mart — ELV & ICT Solutions in Saudi Arabia",
  description:
    "Saudi IT Mart provides ELV, ICT and low-current installation solutions, project execution and technical manpower across Riyadh and Saudi Arabia.",
  keywords: [
    "Saudi IT Mart",
    "ELV",
    "ICT",
    "Saudi Arabia",
    "Structured Cabling",
    "Fiber Optic",
    "CCTV",
    "Access Control",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
