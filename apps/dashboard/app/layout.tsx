import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LakbayPoints Agency Mobility Insights",
  description:
    "Simulated Phase 0B pilot dashboard for verified multimodal mobility insights.",
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
