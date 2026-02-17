export const metadata = {
  title: "Create Solana Token | Create Meme Coin | SolTokenBurner Token Creator",
  description:
    "Create your own meme token on Solana instantly. Set name, symbol, supply, and deploy your token directly to Solana from Phantom using SolTokenBurner.",
  keywords: [
    "create solana token",
    "create meme coin on solana",
    "create meme token on solana",
    "solana token creator",
    "solana token generator",
    "solana token deploy",
    "solana mint create",
    "soltokenburner token creator",
  ],
  alternates: {
    canonical: "https://www.soltokenburner.com/create",
  },
  openGraph: {
    title: "Create SPL Tokens on Solana | SolTokenBurner Token Creator",
    description:
      "Generate a new SPL token on Solana with customizable supply and authorities. Fast, secure, and fully on-chain.",
    url: "https://www.soltokenburner.com/create",
    siteName: "SolTokenBurner",
    images: [
      {
        url: "https://soltokenburner.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "SolTokenBurner - Solana Token Creator",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create SPL Tokens on Solana | SolTokenBurner Token Creator",
    description:
      "Easily create Solana SPL tokens with custom supply and settings using SolTokenBurner.",
    images: ["https://soltokenburner.com/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
