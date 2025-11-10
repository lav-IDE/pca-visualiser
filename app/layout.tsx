import type { Metadata } from "next";
import "./globals.css";
import { use } from "react";

export const metadata: Metadata = {
  title: "PCA Explained - Understanding Principal Component Analysis",
  description: "A simple, visual explanation of PCA for finance professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

