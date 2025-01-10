import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Youtube-Cowatch - YouTube Co-Watch",
  description:
    "Watch YouTube videos together in synchronized rooms with a live chat and emoji reactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Script
          src="https://www.youtube.com/iframe_api"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
