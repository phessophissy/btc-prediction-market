import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { ExtensionErrorSuppressor } from "@/components/ExtensionErrorSuppressor";
import { Footer } from "@/components/Footer";

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
      <head>
        {/* Apply the saved theme before first paint to avoid a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('btc-pm-theme');if(t==='aurora'){document.documentElement.dataset.theme='aurora';}}catch(e){}`,
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <a href="#main-content" className="skip-to-content">Skip to main content</a>
        <ExtensionErrorSuppressor />
        <Providers>
          <Header />
          <main id="main-content" className="app-shell">
            {children}
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}

