import type { Metadata } from "next";
import type { Viewport } from "next";

import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { YandexMetrika } from "@/components/YandexMetrika";


const geistSans = { variable: "--font-geist-sans" };
const geistMono = { variable: "--font-geist-mono" };

// Подключение встроенных локальных шрифтов Geist
// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff2",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });

// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff2",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "black",
};

export const metadata: Metadata = {
  title: "Dmitriy Nikulshin | Fullstack Developer",
  description: "Fullstack-разработчик: React, TypeScript, Node.js, Docker. От концепции до кода.",
  generator: "Next.js",
  manifest: process.env.NODE_ENV === 'production' ? '/manifest.json' : undefined,
  keywords: [
    "Fullstack Developer",
    "React",
    "TypeScript",
    "Node.js",
    "NestJS",
    "Docker",
    "Nikulshin Dmitriy",
    "Никульшин Дмитрий",
    "Портфолио разработчика",
  ],
  authors: [{ name: "Dmitriy Nikulshin", url: "https://github.com/DNikulshin" }],
  openGraph: {
    title: "Dmitriy Nikulshin | Fullstack Developer",
    description: "От концепции до кода: React, TypeScript, Node.js, Docker.",
    url: "https://nikulshin-dev.ru",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased dark`}
      >
        <QueryProvider>{children}</QueryProvider>
        <YandexMetrika />
      </body>
    </html>
  );
}
