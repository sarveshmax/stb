export const metadata = {
  title: "Mint Tokens on Solana | SolTokenBurner Mint Tool",
  description:
    "Mint additional supply for your SPL token on Solana. Fast, secure minting directly from your wallet with SolTokenBurner.",
  keywords: [
    "mint solana token",
    "mint spl token",
    "spl token mint",
    "increase token supply solana",
    "solana mint authority",
    "soltokenburner mint",
  ],
  alternates: {
    canonical: "https://www.soltokenburner.com/mint",
  },
  openGraph: {
    title: "Mint SPL Tokens on Solana | SolTokenBurner Mint Tool",
    description:
      "Easily mint more SPL tokens on Solana with your mint authority. One-click secure minting.",
    url: "https://www.soltokenburner.com/mint",
    siteName: "SolTokenBurner",
    images: [
      {
        url: "https://soltokenburner.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "SolTokenBurner - Mint SPL Tokens",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mint SPL Tokens on Solana | SolTokenBurner Mint Tool",
    description: "Mint more SPL tokens securely using SolTokenBurner's on-chain minting interface.",
    images: ["https://soltokenburner.com/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
