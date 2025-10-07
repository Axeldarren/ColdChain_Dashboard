"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from './redux';
import { useEffect } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function DarkModeWrapper({ children }: { children: React.ReactNode }) {
  const isDarkMode = useSelector((state: RootState) => state.global.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider store={store}>
          <DarkModeWrapper>
            {children}
          </DarkModeWrapper>
        </Provider>
      </body>
    </html>
  );
}
