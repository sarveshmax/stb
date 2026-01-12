import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Client-side wallet provider
import SolanaWalletProvider from "@/components/SolanaWalletProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.soltokenburner.com"),
  title: "Burn Solana Tokens | Burn LP | SolTokenBurner",
  description:
    "Burn Solana SPL and LP Tokens without any coding! Clean up your wallet by burning tokens and claim SOL. Solana Token Burner!",
  alternates: {
    canonical: "https://www.soltokenburner.com",
  },
  keywords:
    "burn solana tokens, burn lp solana, solana token burner, burn spl tokens, burn tokens solana",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Solana providers run ONLY on client */}
        <SolanaWalletProvider>{children}</SolanaWalletProvider>
      </body>
    </html>
  );
}
