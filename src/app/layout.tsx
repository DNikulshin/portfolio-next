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
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <QueryProvider>{children}</QueryProvider>
        <YandexMetrika />
      </body>
    </html>
  );
}
