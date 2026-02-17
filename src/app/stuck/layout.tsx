export const metadata = {
  title: "Burn Stuck Tokens on Solana | SolTokenBurner Incinerator Tool",
  description:
    "Burn SPL tokens stuck in the 1nc1nerator11111111111111111111111111111111 address. Safely remove stuck tokens from the incinerator PDA on Solana.",
  keywords: [
    "burn stuck solana tokens",
    "solana incinerator",
    "1nc1nerator11111111111111111111111111111111",
    "burn spl token",
    "token stuck in incinerator",
    "soltokenburner stuck token burner",
    "solana token cleanup",
  ],
  alternates: {
    canonical: "https://www.soltokenburner.com/stuck",
  },
  openGraph: {
    title: "Burn Stuck Tokens on Solana | SolTokenBurner Incinerator Tool",
    description:
      "Easily detect and burn tokens stuck in the Solana incinerator PDA. Supports SPL & Token-2022 tokens.",
    url: "https://www.soltokenburner.com/stuck",
    siteName: "SolTokenBurner",
    images: [
      {
        url: "https://soltokenburner.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "SolTokenBurner - Burn Stuck Solana Tokens",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Burn Stuck Tokens on Solana | SolTokenBurner Incinerator Tool",
    description:
      "Burn tokens trapped in the incinerator PDA. Full support for SPL and Token-2022 tokens.",
    images: ["https://soltokenburner.com/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
