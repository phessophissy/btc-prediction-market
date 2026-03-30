import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { ExtensionErrorSuppressor } from "@/components/ExtensionErrorSuppressor";

export const metadata: Metadata = {
  title: "BTC Predict Studio",
  description: "A colorful professional Bitcoin-anchored prediction market dashboard on Stacks",
  other: {
    "talentapp:project_verification":
      "483c60cb0e922c47a246a9c22d19ef92dcc289b170675b01dad9cba4a2a589fdbe8a3aa04a701d036a8882daed7ec2940ec6f04aa07fe738b9218a9e3464369f",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ExtensionErrorSuppressor />
        <Providers>
          <Header />
          <main className="app-shell">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
