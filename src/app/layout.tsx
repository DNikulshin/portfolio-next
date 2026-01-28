import type { Metadata } from "next";
import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { YandexMetrika } from "@/components/YandexMetrika";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "black",
};

export const metadata: Metadata = {
  title: "Portfolio | Nikulshin D.",
  description: "Developer page - Nikulshin Dmitry",
  generator: "Next.js",
  // Условно подключаем манифест только для продакшен-сборки
  manifest: process.env.NODE_ENV === 'production' ? '/manifest.json' : undefined,
  keywords: [
    "Portfolio",
    "Developer page",
    "Nikulshin Dmitriy",
    "Портфолио веб разработчика",
    "Никульшин Дмитрий",
  ],
  authors: [
    {
      name: "Nikulshin D.",
      url: "https://github.com/DNikulshin",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <QueryProvider>{children}</QueryProvider>
        <YandexMetrika />
      </body>
    </html>
  );
}
