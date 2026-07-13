import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LakbayPoints MMDA Dashboard",
  description:
    "Competition MVP dashboard foundation for verified mode-shift corridor insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
