export const metadata = {
  title: "Burn Solana Tokens & Claim SOL | SolTokenBurner Cleaner",
  description:
    "Clean your Solana wallet by burning unwanted SPL tokens, LP tokens, and claiming back rent SOL. Fast, secure, and easy using SolTokenBurner.",
  keywords: [
    "burn solana token",
    "burn tokens solana",
    "burn and claim sol",
    "burn tokens and claim solana",
    "sol incinerator alternative",
    "sol incinerator",
    "solana token burner",
    "SolTokenBurner",
  ],
  alternates: {
    canonical: "https://www.soltokenburner.com/cleaner",
  },
  openGraph: {
    title: "Burn Solana Tokens & Claim SOL | SolTokenBurner Cleaner",
    description:
      "Burn unwanted SPL tokens, burn liquidity pool tokens, and claim rent-exempt SOL from your Solana wallet using SolTokenBurner.",
    url: "https://www.soltokenburner.com/cleaner",
    siteName: "SolTokenBurner",
    images: [
      {
        url: "https://soltokenburner.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "SolTokenBurner - Solana Wallet Cleaner",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Burn Solana Tokens & Claim SOL | SolTokenBurner Cleaner",
    description:
      "Clean your Solana wallet: burn SPL tokens, LP tokens, and claim SOL easily using SolTokenBurner.",
    images: ["https://soltokenburner.com/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
