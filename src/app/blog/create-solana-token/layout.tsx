export const metadata = {
  title: "How to Create a Solana Token (2025 Guide) | SolTokenBurner Tutorial",
  description:
    "Step-by-step guide on how to create your own SPL token on Solana, set metadata, mint supply, and add liquidity. Beginner-friendly tutorial.",
  keywords: [
    "how to create solana token",
    "solana token guide",
    "solana token tutorial",
    "create spl token guide",
    "add liquidity solana",
    "solana token creation tutorial",
  ],
  alternates: {
    canonical: "https://www.soltokenburner.com/blog/create-solana-token",
  },
  openGraph: {
    title: "How to Create a Solana Token (2025 Guide) | SolTokenBurner",
    description:
      "Full guide on creating SPL tokens on Solana: token creator, minting, metadata, liquidity, and authorities.",
    url: "https://www.soltokenburner.com/blog/create-solana-token",
    siteName: "SolTokenBurner",
    images: [
      {
        url: "https://soltokenburner.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "SolTokenBurner - Solana Token Guide",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Create a Solana Token (2025 Guide)",
    description:
      "Learn step-by-step how to create your own SPL token on Solana with SolTokenBurner.",
    images: ["https://soltokenburner.com/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
