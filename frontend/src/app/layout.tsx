import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { ExtensionErrorSuppressor } from "@/components/ExtensionErrorSuppressor";

export const metadata: Metadata = {
  title: "BTC Prediction Market",
  description: "Bitcoin-anchored decentralized prediction market on Stacks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ExtensionErrorSuppressor />
        <Providers>
          <Header />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
