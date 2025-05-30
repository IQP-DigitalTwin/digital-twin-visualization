"use client";
import React from "react";
import Sidebar from "@/components/Sidebar";
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <div style={{ position: 'relative', flex: 1 }}>
            <div style={{ height: '100vh', overflowY: 'auto' }}>
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
